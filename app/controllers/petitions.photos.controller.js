const petitionsPhotos = require('../models/petitions.photos.model');

exports.viewHero = async function(req, res) {
    console.log( '\nRequest to view a hero image for a petition...' );
    let petitionId = req.params.id;

    try {
        const imageDetails = await petitionsPhotos.getOne(petitionId);
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