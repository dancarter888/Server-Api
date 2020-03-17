const petitions = require('../models/petitions.model');

exports.list = async function(req, res) {
    console.log( '\nRequest to list petitions...' );
    let startIndex = req.query.startIndex;
    let count = req.query.count;
    let q = req.query.q;
    let categoryId = req.query.categoryId;
    let authorId = req.query.authorId;
    let sortBy = req.query.sortBy;

    try {
        const result = await petitions.getAll(q, categoryId, authorId, sortBy);

        if( result.length === 0 ){
            res.status(400)
                .send('Bad Request');
        }
        else {
            //Format the result data (Get Category name from id and author name from id and signature count)

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
    //Change this for other authors
    let authorId = 1;
    let categoryId = req.body.categoryId;
    let closingDate = req.body.closingDate;
    let today = new Date();
    let closing = new Date(closingDate);

    //Send status 401 Unauthorized
    if (closing < today) {
        console.log('Unauthorized');
    }

    //Send status 400 Bad Request

    try {
        const result = await petitions.insert(title, description, authorId, categoryId, today, closingDate);
        res.status( 200 )
            .send( 'Petition created!' );
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error', err );
    }
};