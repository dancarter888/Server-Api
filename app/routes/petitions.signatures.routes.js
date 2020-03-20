const petitionsSignatures = require( '../controllers/petitions.signatures.controller' );

module.exports = function(app) {
    app.route(app.rootUrl + '/petitions/:id/signatures')
        .get(petitionsSignatures.list);
        /*.post(petitionsSignatures.sign)
        .delete(petitionsSignatures.remove);*/
};