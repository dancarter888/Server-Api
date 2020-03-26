const usersPhotos = require('../models/users.photos.model');
const photosDirectory = 'storage/photos/';
const fs = require('mz/fs');

exports.view = async function(req, res) {
    console.log( '\nRequest to view a hero image for a user...' );
    let userId = req.params.id;

    try {
        const imageDetails = await usersPhotos.getOne(userId);
        console.log(imageDetails);

        if(imageDetails === null) {
            res.statusMessage = "Not Found";
            res.status(404)
                .send();
        } else {
            res.statusMessage = "OK";
            res.status(200).contentType(imageDetails.mimeType).send(imageDetails.image);
        }

    } catch( err ) {
        console.log(err);
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};
