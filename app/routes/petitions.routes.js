const petitions = require( '../controllers/petitions.controller' );

module.exports = function(app) {
    app.route(app.rootUrl + '/petitions')
        .get(petitions.list)
};