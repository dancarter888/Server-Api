const petitions = require( '../controllers/petitions.controller' );

module.exports = function(app) {
    app.route(app.rootUrl + '/petitions')
        .get(petitions.list)
        .post(petitions.create);
};

/*
module.exports = function(app) {
    app.route(app.rootUrl + '/petitions/:id')
        .get(petitions.list)
        .patch(petitions.create)
        .delete(petitions.create);
};
*/

/*
module.exports = function(app) {
    app.route(app.rootUrl + '/petitions/categories')
        .get(petitions.list);
};
*/
