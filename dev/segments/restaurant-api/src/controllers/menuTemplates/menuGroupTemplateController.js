const MenuGroupTemplate = require('../../models/MenuGroupTemplate');
const utils = require('../../utils/utils');
const mongoose = require('mongoose');

// POST - Crear un nuevo MenuGroupTemplate
// POST - Crear un nuevo MenuGroupTemplate
exports.create = async (req, res) => {
  try {
    const authBusinessId = req.authUser.businessId;
    const { value, parentId } = req.body;
    
    // Normalizar el valor
    const normalizedValue = value.trim().toLowerCase();

    // Validar que no exista el mismo value para este negocio en el mismo nivel jerárquico
    const existingGroup = await MenuGroupTemplate.findOne({
      businessId: authBusinessId,
      value: normalizedValue,
      parentId: parentId || null
    });

    if (existingGroup) {
      return res.status(400).json({
        error: `Menu group "${value}" already exists at this level for your business`
      });
    }

    // Configuración de valores para la jerarquía
    let isRoot = true;
    let level = 0;
    let path = '';

    // Si tiene parentId, buscar información del padre
    if (parentId) {
      const parentGroup = await MenuGroupTemplate.findOne({
        _id: parentId,
        businessId: authBusinessId
      });

      if (!parentGroup) {
        return res.status(404).json({
          error: "Parent group not found for your business"
        });
      }

      isRoot = false;
      level = parentGroup.level + 1;
      // CORRECCIÓN AQUÍ: Usar el path del padre sin añadir otra vez su ID
      path = parentGroup.path || parentGroup._id.toString();
    }

    const newGroup = new MenuGroupTemplate({
      ...req.body,
      value: normalizedValue,
      businessId: authBusinessId,
      parentId: parentId || null,
      isRoot,
      level,
      path
    });

    await newGroup.save();

    // Actualizar el path después de obtener el ID y añadir el ID del nuevo grupo al path
    if (isRoot) {
      newGroup.path = newGroup._id.toString();
    } else {
      // Añadir el ID del nuevo grupo al path
      newGroup.path = `${path}/${newGroup._id}`;
    }
    await newGroup.save();

    const { businessId, ...cleaned } = newGroup.toObject();
    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error creating MenuGroupTemplate:', err);
    res.status(400).json({ error: 'Error creating menu group', details: err.message });
  }
};

// PATCH - Actualizar un MenuGroupTemplate
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;
    const { value, parentId, i18n, isActive } = req.body;

    // Encontrar el grupo existente
    const existingGroup = await MenuGroupTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!existingGroup) {
      return res.status(404).json({ error: 'Menu group not found for your business' });
    }

    // Preparar las actualizaciones
    const updates = {};

    // Actualizar value si se proporciona
    if (value !== undefined) {
      const normalizedValue = value.trim().toLowerCase();
      
      // Verificar duplicados solo si el valor cambia
      if (normalizedValue !== existingGroup.value) {
        const duplicate = await MenuGroupTemplate.findOne({
          businessId: authBusinessId,
          value: normalizedValue,
          parentId: existingGroup.parentId,
          _id: { $ne: id }
        });

        if (duplicate) {
          return res.status(400).json({
            error: `Another menu group with value "${value}" already exists at this level`
          });
        }
        
        updates.value = normalizedValue;
      }
    }

    // Actualizar i18n si se proporciona
    if (i18n !== undefined) {
      updates.i18n = i18n;
    }

    // Actualizar isActive si se proporciona
    if (isActive !== undefined) {
      updates.isActive = isActive;
    }

    // Manejar cambio de padre
    if (parentId !== undefined && String(parentId) !== String(existingGroup.parentId)) {
      // Evitar referencias circulares
      if (String(parentId) === String(id)) {
        return res.status(400).json({
          error: "A group cannot be its own parent"
        });
      }

      if (parentId) {
        // Verificar que el padre existe y pertenece al mismo negocio
        const parentGroup = await MenuGroupTemplate.findOne({
          _id: parentId,
          businessId: authBusinessId
        });

        if (!parentGroup) {
          return res.status(404).json({
            error: "Parent group not found for your business"
          });
        }

        // Verificar que el nuevo padre no sea un descendiente
        if (parentGroup.path && parentGroup.path.includes(id)) {
          return res.status(400).json({
            error: "Cannot set a descendant as parent (circular reference)"
          });
        }

        updates.parentId = parentId;
        updates.isRoot = false;
        updates.level = parentGroup.level + 1;
        updates.path = parentGroup.path ? `${parentGroup.path}/${parentId}` : String(parentId);
      } else {
        // Si se está cambiando a un grupo raíz
        updates.parentId = null;
        updates.isRoot = true;
        updates.level = 0;
        updates.path = String(id);
      }
    }

    // Si no hay actualizaciones, informar que no se han hecho cambios
    if (Object.keys(updates).length === 0) {
      return res.status(200).json({ 
        message: "No changes to update",
        ...existingGroup.toObject({ flattenMaps: true })
      });
    }

    // Aplicar las actualizaciones
    const updatedGroup = await MenuGroupTemplate.findByIdAndUpdate(
      id, 
      { $set: updates }, 
      { new: true, runValidators: true }
    );

    // Si cambiamos la jerarquía, actualizar los descendientes
    if (updates.path !== undefined) {
      // Buscar todos los descendientes
      const descendants = await MenuGroupTemplate.find({
        businessId: authBusinessId,
        path: { $regex: new RegExp(`/${id}(/|$)`) }
      });

      // Actualizar el path y level de todos los descendientes
      for (const descendant of descendants) {
        // Calcular el nivel relativo de este descendiente respecto al grupo actualizado
        const levelDiff = descendant.level - existingGroup.level;
        
        // Calcular el nuevo path reemplazando la parte antigua con la nueva
        const oldPathPrefix = existingGroup.path ? `${existingGroup.path}/${id}` : String(id);
        const newPathPrefix = updates.path ? `${updates.path}/${id}` : String(id);
        
        const newPath = descendant.path.replace(oldPathPrefix, newPathPrefix);
        const newLevel = updates.level + levelDiff;
        
        await MenuGroupTemplate.updateOne(
          { _id: descendant._id },
          { 
            $set: {
              path: newPath,
              level: newLevel
            }
          }
        );
      }
    }

    // Obtener el grupo actualizado con todos los cambios
    const finalGroup = await MenuGroupTemplate.findById(id);
    const { businessId, ...cleaned } = finalGroup.toObject({ flattenMaps: true });
    
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error updating MenuGroupTemplate:', err);
    res.status(400).json({ error: 'Error updating menu group', details: err.message });
  }
};

// GET - Obtener un MenuGroupTemplate por ID
exports.getById = async (req, res) => {
  // Esta función permanece prácticamente igual
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const group = await MenuGroupTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!group) {
      return res.status(404).json({ error: 'Menu group not found for your business' });
    }

    const { businessId, ...cleaned } = group.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error retrieving MenuGroupTemplate by ID:', err);
    res.status(400).json({ error: 'Error retrieving menu group', details: err.message });
  }
};

// POST - Obtener todos los MenuGroupTemplates
exports.getAll = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const groups = await MenuGroupTemplate.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(groups);

  } catch (err) {
    console.error('💥 Error retrieving MenuGroupTemplates:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET - Obtener la estructura jerárquica de grupos
exports.getHierarchy = async (req, res) => {
  try {
    const authBusinessId = req.authUser.businessId;
    
    // Obtener todos los grupos para este negocio
    const allGroups = await MenuGroupTemplate.find({
      businessId: authBusinessId
    }).lean();
    
    // Función para construir la jerarquía
    const buildHierarchy = (items, parentId = null) => {
      return items
        .filter(item => 
          (parentId === null && item.isRoot) || 
          (item.parentId && item.parentId.toString() === parentId)
        )
        .map(item => ({
          ...item,
          children: buildHierarchy(items, item._id.toString())
        }));
    };
    
    // Construir la jerarquía
    const hierarchy = buildHierarchy(allGroups);
    
    res.json(hierarchy);
  } catch (err) {
    console.error('💥 Error retrieving menu groups hierarchy:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET - Obtener los subgrupos de un grupo específico
exports.getSubgroups = async (req, res) => {
  try {
    const { parentId } = req.params;
    const authBusinessId = req.authUser.businessId;
    
    // Validar que el grupo padre existe y pertenece a este negocio
    if (parentId !== 'root') {
      const parentExists = await MenuGroupTemplate.exists({
        _id: parentId,
        businessId: authBusinessId
      });
      
      if (!parentExists) {
        return res.status(404).json({ error: 'Parent group not found for your business' });
      }
    }
    
    // Buscar subgrupos
    const query = {
      businessId: authBusinessId
    };
    
    if (parentId === 'root') {
      query.isRoot = true;
    } else {
      query.parentId = parentId;
    }
    
    const subgroups = await MenuGroupTemplate.find(query)
      .select('-businessId -__v')
      .lean();
    
    res.json(subgroups);
  } catch (err) {
    console.error('💥 Error retrieving subgroups:', err);
    res.status(400).json({ error: 'Error retrieving subgroups', details: err.message });
  }
};