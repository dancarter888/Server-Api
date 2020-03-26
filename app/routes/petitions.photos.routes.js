const petitionsPhotos = require( '../controllers/petitions.photos.controller' );
const authenticate = require('../middleware/cors.middleware');


module.exports = function(app) {
    app.route(app.rootUrl + '/petitions/:id/photo')
        .get(petitionsPhotos.viewHero)
        .put(authenticate.loginRequired, petitionsPhotos.setHero);
};