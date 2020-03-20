/*
const usersPhotos = require('../models/users.photos.model');

exports.view = async function(req, res) {
    let reqUserId = req.params.id;
    console.log( '\nRequest to view a user...' );

    try {
        const result = await users.getOne(reqUserId, authenticatedUserId);
        if (result === null) {
            res.statusMessage = "Not Found";
            res.status(404)
                .send();
        } else {
            res.statusMessage = "OK";
            res.status(200)
                .send(result);
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};*/
