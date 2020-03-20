const users = require( '../controllers/users.controller' );
const authenticate = require('../middleware/cors.middleware');

module.exports = function(app) {
    app.route(app.rootUrl + '/users/register')
        .post(users.register);

    app.route(app.rootUrl + '/users/login')
        .post(users.login);

    app.route(app.rootUrl + '/users/logout')
        .post(authenticate.loginRequired, users.logout);


    app.route(app.rootUrl + '/users/:id')
        .get(authenticate.loginOptional, users.view);
/*
    app.route(app.rootUrl + '/users/logout')
        .post(users.change);

 */
};
