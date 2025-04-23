const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const zoneRoutes = require('./routes/zone.routes');

dotenv.config();

const app = express();
app.use(express.json());

// JWT middleware
const authenticate = require('./middlewares/auth.middleware');
app.use(authenticate); // Protege todas las rutas por defecto

const zoneTemplateRoutes = require('./routes/zoneTemplate.routes');
app.use('/zone-templates', zoneTemplateRoutes);

// Routes
app.use('/zones', zoneRoutes);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const PORT = process.env.PORT || 3003;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Zones API listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});
