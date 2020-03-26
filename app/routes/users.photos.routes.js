const usersPhotos = require( '../controllers/users.photos.controller' );
const authenticate = require('../middleware/cors.middleware');

module.exports = function(app) {
    app.route(app.rootUrl + '/users/:id/photo')
        .get(usersPhotos.view)
        .put(authenticate.loginRequired, usersPhotos.set)
        .delete(authenticate.loginRequired, usersPhotos.remove);
};

