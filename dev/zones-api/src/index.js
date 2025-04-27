// src/index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const zoneRoutes = require('./routes/zone.routes');
const zoneTemplateRoutes = require('./routes/zoneTemplate.routes');
const authenticate = require('./middlewares/auth.middleware');

dotenv.config();

const app = express();
app.use(express.json());

// Public routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/zones-demo', express.static(path.join(__dirname, '../docs')));

// Protected routes
app.use('/zones', authenticate, zoneRoutes);
app.use('/zone-templates', authenticate, zoneTemplateRoutes);

const PORT = process.env.PORT || 3003;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(`\n✅ Connected to MongoDB: ${process.env.MONGO_URI}`);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 zones-api running at http://0.0.0.0:${PORT}`);

    // Log loaded routes
    setTimeout(() => {
      const stack = app._router?.stack ?? [];
      const routes = stack
        .filter(layer => layer.route && layer.route.path)
        .map(layer => {
          const methods = Object.keys(layer.route.methods)
            .map(method => method.toUpperCase())
            .join(', ');
          return `[ROUTE] ${methods} ${layer.route.path}`;
        });

      if (routes.length > 0) {
        console.log('\n📦 Registered routes:');
        routes.forEach(route => console.log(route));
      } else {
        console.log('\n⚠️ No route paths found in stack');
      }
    }, 1000);
  });
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
