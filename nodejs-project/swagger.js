const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Load Swagger JSON file
const swaggerFile = path.join(__dirname, 'swagger.json');
const swaggerData = JSON.parse(fs.readFileSync(swaggerFile, 'utf8'));

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerData));
};

module.exports = setupSwagger;
