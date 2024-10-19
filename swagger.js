const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Products Api',
        description: 'Products Api'
    },
    host: 'project2-kbfe.onrender.com',
    schemes: ['http, https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// this will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
