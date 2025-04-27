const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const mongoURI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

try {
  const businessRoutes = require('./routes/restaurantBusinessRoutes');
  app.use('/api/restaurants', businessRoutes);

  const branchRoutes = require('./routes/restaurantBranchRoutes');
  app.use('/api/branches', branchRoutes);

  const branchUserRoutes = require('./routes/branchUserRoutes');
  app.use('/api/branch-users', branchUserRoutes);

  const userRoutes = require('./routes/restaurantUserRoutes');
  app.use('/api/restaurant-users', userRoutes);
  
  const attributeRoutes = require('./routes/attribute/attributeRoutes');
  app.use('/api/restaurants/attributes', attributeRoutes);

  const attributeValueRoutes = require('./routes/attribute/attributeValueRoutes');
  app.use('/api/restaurants/attributeValue', attributeValueRoutes);

  const taxRate = require('./routes/configuration/taxRateRoutes');
  app.use('/api/restaurants/taxRate', taxRate);

  const allergen = require('./routes/configuration/allergenRoutes');
  app.use('/api/restaurants/allergen', allergen);

  const salesCategoryTemplate = require('./routes/configuration/salesCategoryTemplateRoutes');
  app.use('/api/restaurants/salesCategoryTemplate', salesCategoryTemplate);

  const menuTagTemplate = require('./routes/configuration/menuTagTemplateRoutes');
  app.use('/api/restaurants/menuTagTemplate', menuTagTemplate);

  const modifierOptionTemplate = require('./routes/configuration/modifierOptionTemplateRoutes');
  app.use('/api/restaurants/modifierOptionTemplate', modifierOptionTemplate);

  const modifierGroupTemplate = require('./routes/configuration/modifierGroupTemplateRoutes');
  app.use('/api/restaurants/modifierGroupTemplate', modifierGroupTemplate);

  const portionTemplate = require('./routes/configuration/portionTemplateRoutes');
  app.use('/api/restaurants/portionTemplate', portionTemplate);

  

  

  const setupSwagger = require('./config/swagger'); // Ajustá el path si cambia
  setupSwagger(app);
  //const authenticate = require('./middleware/authenticate-a-borrar');


  console.log('[✅] Routes mounted at /api/restaurants');
} catch (err) {
  console.error('[💥 ERROR AL CARGAR RUTAS]', err);
}

// Conexión a MongoDB del segmento
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('[🍽️ MongoDB] Connected to restaurant_db'))
.catch(err => console.error('[❌ MongoDB] Error:', err));

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('🍽️ Proxime Restaurant Segment is alive!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[🚀 Restaurant API] Running on http://0.0.0.0:${port}`);

  // Mostrar rutas registradas después del arranque
  setTimeout(() => {
    try {
      const stack = app?._router?.stack ?? [];
      const routes = stack
        .filter(layer => layer.route && layer.route.path)
        .map(layer => {
          const methods = Object.keys(layer.route.methods)
            .map(method => method.toUpperCase())
            .join(', ');
          return `[ROUTE] ${methods} ${layer.route.path}`;
        });
  
      if (routes.length > 0) {
        console.log('[📦] Registered routes:');
        routes.forEach(route => console.log(route));
      } else {
        console.log('[⚠️] No route paths found in stack');
      }
    } catch (err) {
      console.log('[💥] Failed to inspect routes:', err.message);
    }
  }, 1000);
});

