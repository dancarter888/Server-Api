const petitions = require( '../controllers/petitions.controller' );

module.exports = function(app) {
    app.route(app.rootUrl + '/petitions')
        .get(petitions.list)
        .post(petitions.create);

    app.route(app.rootUrl + '/petitions/:id')
        .get(petitions.view)
        .patch(petitions.edit)
        .delete(petitions.delete);

    app.route(app.rootUrl + '/petitions/categories')
        .get(petitions.listCategories);
};
