const petitionsSignatures = require( '../controllers/petitions.signatures.controller' );
const authenticate = require('../middleware/cors.middleware');

module.exports = function(app) {
    app.route(app.rootUrl + '/petitions/:id/signatures')
        .get(petitionsSignatures.list)
        .post(authenticate.loginRequired, petitionsSignatures.sign)
        .delete(authenticate.loginRequired, petitionsSignatures.remove);
};