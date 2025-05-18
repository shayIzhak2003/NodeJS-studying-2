const express = require('express');
const router = require('./Services/webServices'); 
const router2 = require('./Services/trade-sys'); 

const PORT = 3000;
const app = express();

const { runMe } = require('./Services/cmd-service');
const { connectDB } = require('./Services/dao');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Swagger Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Trading API',
      version: '1.0.0',
      description: 'API for managing users and stock trading',
    },
  },
  apis: ['./Services/webServices.js'], // Ensure the correct path and extension
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use('/api', router); 
// app.use('/trade-api', router2); 

// connectDB(); // Uncomment if needed

app.listen(PORT, () => {
  console.log(`added a new commit to push.`);
  console.log(`Server running on http://localhost:${PORT}`);
  // runMe();
});
