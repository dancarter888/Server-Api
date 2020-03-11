const petitions = require('../models/petitions.model');

exports.list = async function(req, res) {
    console.log( '\nRequest to list petitions...' );
    try {
        const result = await petitions.getAll();
        //CHANGE THIS
        if( result.length === 0 ){
            res.status(400)
                .send('Bad Request');
        }
        else {
            res.status(200)
                .send(result);
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error' );
    }
};