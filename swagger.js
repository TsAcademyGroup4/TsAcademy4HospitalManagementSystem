import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospital Management System API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for the Hospital Management System',
      contact: {
        name: 'Hospital Management System',
        url: 'https://github.com/TsAcademyGroup4/TsAcademy4HospitalManagementSystem'
      }
    },
    servers: [
      {
        url: 'http://localhost:5050',
        description: 'Development server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token for authentication'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'An error occurred'
            },
            data: {
              type: 'object'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              type: 'object'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/authRoutes.js',
    './routes/adminRoutes.js',
    './routes/appointmentRoutes.js',
    './routes/consultationRoutes.js',
    './routes/patientRoutes.js',
    './routes/admissionWardRoute.js',
    './routes/pharmacyRoutes.js',
    './routes/prescriptionRoutes.js'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
