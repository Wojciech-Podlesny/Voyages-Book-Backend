import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "Voyages Book API",
         version: "1.0.0",
         description: "API documentation for the Voyages Booking system"
      },
      servers: [
         {
            url: "http://localhost:3000",
            description: "Local server"
         }
      ],
      commponents: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
   },
   apis: ["./src/controllers/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);