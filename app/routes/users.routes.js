const users = require( '../controllers/users.controller' );

module.exports = function(app) {
    app.route(app.rootUrl + '/users/register')
        .post(users.register);
/*
    app.route(app.rootUrl + '/users/logim')
        .post(users.login);

    app.route(app.rootUrl + '/users/logout')
        .post(users.logout);

    app.route(app.rootUrl + '/users/:id')
        .get(users.view);

    app.route(app.rootUrl + '/users/logout')
        .post(users.change);*/
};