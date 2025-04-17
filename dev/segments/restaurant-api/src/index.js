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
  
  const authenticate = require('./middlewares/authenticate');


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

