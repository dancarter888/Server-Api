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

exports.create = async function(req, res) {
    console.log( '\nRequest to add a new petition...' );
    let title = req.body.title;
    let description = req.body.description;
    let authorId = 1;
    let categoryId = req.body.categoryId;
    let closingDate = req.body.closingDate;

    let today = new Date();
    let closing = new Date(closingDate);

    if (closing < today) {
        console.log('Unauthorized');
    }

    try {
        console.log("Hi");
        const result = await petitions.insert(title, description, authorId, categoryId, today, closingDate);
        res.status( 200 )
            .send( 'Petition created!' );
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error', err );
    }
};