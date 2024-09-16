const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0", // OpenAPI version
  info: {
    title: "Your API Title", // API title
    version: "1.0.0", // API version
    description: "Your API description", // API description
  },
  servers: [
    {
      url: "http://localhost:5000", // URL of your API
      description: "Development server",
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to your API docs (usually where you define routes)
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
