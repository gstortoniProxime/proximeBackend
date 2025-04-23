const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zones API - Proxime',
      version: '1.0.0',
      description: 'Microservice for managing hierarchical zones and templates'
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js'] // <- Documentación por anotaciones
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
