const express = require('express');
const bodyParser = require('body-parser');
const { allowCrossOriginRequestsMiddleware } = require('../app/middleware/cors.middleware');


module.exports = function () {
    // INITIALISE EXPRESS //
    const app = express();
    app.rootUrl = '/api/v1';

    // MIDDLEWARE
    app.use(allowCrossOriginRequestsMiddleware);
    app.use(bodyParser.json());
    app.use(bodyParser.raw({ type: 'text/plain' }));  // for the /executeSql endpoint

    // ROUTES
    require('../app/routes/backdoor.routes')(app);
    require('../app/routes/petitions.routes')(app);
    require('../app/routes/users.routes')(app);
    require('../app/routes/petitions.signatures.routes')(app);
    require('../app/routes/petitions.photos.routes')(app);
    require('../app/routes/users.photos.routes')(app);

    return app;
};
