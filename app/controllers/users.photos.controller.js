const usersPhotos = require('../models/users.photos.model');
const photosDirectory = 'storage/photos/';
const fs = require('mz/fs');

exports.view = async function(req, res) {
    console.log( '\nRequest to view an image for a user...' );
    let userId = req.params.id;

    try {
        const imageDetails = await usersPhotos.getOne(userId);

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
        res.statusMessage = "Internal Server Error";
        res.status( 500 )
            .send();
    }
};

exports.set = async function(req, res) {
    console.log( '\nRequest to view an image for a user...' );
    let userId = req.params.id;
    let authenticatedUserId = req.authenticatedUserId;
    var filename = "user_" + userId.toString();
    let extension = "";


    try {
        const valid_user_id = await usersPhotos.checkUser(userId);

        if (req.header('Content-Type') === "image/png") {
            extension = ".png";
            filename += extension;

        } else if (req.header('Content-Type') === "image/jpeg") {
            extension = ".jpg";
            filename += extension;

        }  else if (req.header('Content-Type') === "image/gif") {
            extension = ".gif";
            filename += extension;

        }
        if (extension === ""){
            res.statusMessage = "Bad Request";
            res.status(400)
                .send();
        } else {
            if (valid_user_id === undefined) { //Check if petitionId exists else 404 Not Found
                res.statusMessage = "Not Found";
                res.status(404)
                    .send();
            } else if (valid_user_id.toString() !== authenticatedUserId) { //Check if authorId is same as authenticatedUserId else 403 Forbidden
                res.statusMessage = "Forbidden";
                res.status(403)
                    .send();
            } else {
                if (await usersPhotos.checkImage(valid_user_id) === null) { //Check if image is null, if so send 201 Created
                    req.pipe(fs.createWriteStream(photosDirectory + filename)); //Write to directory
                    await usersPhotos.updateImage(valid_user_id, filename);
                    res.statusMessage = "Created";
                    res.status(201)
                        .send();
                } else { //Else if image exists send 200 OK
                    req.pipe(fs.createWriteStream(photosDirectory + filename)); //Write to directory
                    await usersPhotos.updateImage(valid_user_id, filename);
                    res.statusMessage = "OK";
                    res.status(200)
                        .send();
                }
            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status( 500 )
            .send();
    }
};

exports.remove = async function(req, res) {
    console.log( '\nRequest to remove an image for a user...' );
    let userId = req.params.id;
    let authenticatedUserId = req.authenticatedUserId;

    try {
        const userPhoto = await usersPhotos.checkUserForDelete(userId);

        if (userPhoto === undefined) { //Check if user and user photo exists else 404 Not Found
            res.statusMessage = "Not Found";
            res.status(404)
                .send();
        } else if (userId.toString() !== authenticatedUserId) { //Check if authorId is same as authenticatedUserId else 403 Forbidden
            res.statusMessage = "Forbidden";
            res.status(403)
                .send();
        } else { //Else if image exists send 200 OK
            await usersPhotos.deleteImage(userId);
            res.statusMessage = "OK";
            res.status(200)
                .send();
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status( 500 )
            .send();
    }
};