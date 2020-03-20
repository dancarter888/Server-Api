const petitionsSignatures = require('../models/petitions.signatures.model');

exports.list = async function(req, res) {
    console.log( '\nRequest to list signatures of a petition...' );
    let petitionId = req.params.id;

    try {
        const result = await petitionsSignatures.getAll(petitionId);
        console.log(result);

        if(result.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404)
                .send('Bad Request');
        } else {
            res.status(200)
                .send(result);
        }

    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};