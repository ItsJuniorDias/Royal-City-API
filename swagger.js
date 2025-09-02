const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Users",
      version: "1.0.0",
      description: "Documentação da API de Usuários com Swagger",
    },
    servers: [
      {
        url: "http://localhost:4000/api/v1",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Route for view doc
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Route for access json
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    `📖 Swagger docs disponível em http://localhost:${port}/api-docs`
  );
}

module.exports = swaggerDocs;
