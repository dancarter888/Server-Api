const petitionsPhotos = require('../models/petitions.photos.model');
const photosDirectory = 'storage/photos/';
const fs = require('mz/fs');

exports.viewHero = async function(req, res) {
    console.log( '\nRequest to view a hero image for a petition...' );
    let petitionId = req.params.id;

    try {
        const imageDetails = await petitionsPhotos.getOne(petitionId);

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

exports.setHero = async function(req, res) {
    console.log( '\nRequest to view a hero image for a petition...' );
    let petitionId = req.params.id;
    let authenticatedUserId = req.authenticatedUserId;
    var filename = "petition_" + petitionId.toString();
    let extension = "";


    try {
        const authorId = await petitionsPhotos.checkAuthor(petitionId);
        console.log(authorId);

        if (req.header('Content-Type') === "image/png") {
            extension = ".png";
            filename += extension;
            console.log(filename);
        } else if (req.header('Content-Type') === "image/jpeg") {
            extension = ".jpg";
            filename += extension;
            console.log(filename);
        }  else if (req.header('Content-Type') === "image/gif") {
            extension = ".gif";
            filename += extension;
            console.log(filename);
        }
        if (extension === ""){
            res.statusMessage = "Bad Request";
            res.status(400)
                .send();
        } else {
            if (authorId === undefined) { //Check if petitionId exists else 404 Not Found
                res.statusMessage = "Not Found";
                res.status(404)
                    .send();
            } else if (authorId.toString() !== authenticatedUserId) { //Check if authorId is same as authenticatedUserId else 403 Forbidden
                res.statusMessage = "Forbidden";
                res.status(403)
                    .send();
            } else {
                if (await petitionsPhotos.checkImage(petitionId) === null) { //Check if image is null, if so send 201 Created
                    req.pipe(fs.createWriteStream(photosDirectory + filename)); //Write to directory
                    await petitionsPhotos.updateImage(petitionId, filename);
                    res.statusMessage = "Created";
                    res.status(201)
                        .send();
                } else { //Else if image exists send 200 OK
                    req.pipe(fs.createWriteStream(photosDirectory + filename)); //Write to directory
                    await petitionsPhotos.updateImage(petitionId, filename);
                    res.statusMessage = "OK";
                    res.status(200)
                        .send();
                }
            }
        }
    } catch( err ) {
        console.log(err);
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};