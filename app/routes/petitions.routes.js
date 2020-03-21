const petitions = require( '../controllers/petitions.controller' );
const authenticate = require('../middleware/cors.middleware');

module.exports = function(app) {
    app.route(app.rootUrl + '/petitions')
        .get(petitions.list)
        .post(authenticate.loginRequired, petitions.create);

    app.route(app.rootUrl + '/petitions/categories')
        .get(petitions.listCategories);

    app.route(app.rootUrl + '/petitions/:id')
        .get(petitions.view)
        .patch(petitions.edit)
        .delete(petitions.delete);
};
