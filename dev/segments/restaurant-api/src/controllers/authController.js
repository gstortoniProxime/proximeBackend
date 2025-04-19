const jwt = require('jsonwebtoken');
const AuthUser = require('../models/AuthUser');
const utils = require('../utils/utils');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AuthUser.findOne({ email, isActive: true }).lean();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userInstance = new AuthUser(user); // recreás para usar comparePassword
    const match = await userInstance.comparePassword(password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Removemos el password del payload
    const { password: _, ...safePayload } = user;

    const token = jwt.sign(safePayload, process.env.RESTAURANT_API_SECRET, { expiresIn: '2h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new AuthUser(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {

  try {

    //Validar que el usuario tenga el rol de admin
    utils.validateRole(req.coreApp, 'admin');
    
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'El campo "email" es obligatorio para actualizar.' });
    }

    const user = await AuthUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Validar que el usuario sea del mismo negocio.

    utils.validateBusinessAccess(user.businessId,req.coreApp);

   
    // Lista blanca de campos actualizables
    const updatableFields = ['role', 'branches', 'name', 'isActive'];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({ message: 'Usuario actualizado correctamente.', user });

  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {

  try {
    //const getUsers = AuthUser.find(req.coreApp.businessId);
    const users = await AuthUser.find({ businessId: req.coreApp.businessId }).select('-password');
    // Removemos el password del payload
    const { password: _, ...safePayload } = users;

    res.status(201).json(safePayload);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};