const petitions = require('../models/petitions.model');

exports.list = async function(req, res) {
    console.log( '\nRequest to list petitions...' );
    let startIndex = req.query.startIndex;
    let count = req.query.count;
    let q = req.query.q;
    let categoryId = req.query.categoryId;
    let authorId = req.query.authorId;
    let sortBy = req.query.sortBy;
    let returnedResults = [];

    try {
        const result = await petitions.getAll(q, categoryId, authorId, sortBy);

        if (startIndex ===  undefined) {
            startIndex = 0;
        }
        if (count === undefined) {
            count = result.length;
        }

        if( result!== null && result.length !== 0 ) {
            for (let i = 0; i < count; i++) {
                console.log(startIndex);
                if ((startIndex) >= result.length) {
                    break;
                }
                console.log(result[startIndex]);
                returnedResults.push(result[startIndex]);
                startIndex++;
            }
        }

        if(result === null) {
            res.status(400)
                .send('Bad Request');
        } else {
            res.status(200)
                .send(returnedResults);
        }

    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};

exports.create = async function(req, res) {
    console.log( '\nRequest to add a new petition...' );
    let title = req.body.title;
    let description = req.body.description;
    let authorId = req.authenticatedUserId;
    let categoryId = req.body.categoryId;
    let closingDate = req.body.closingDate;
    let today = new Date();
    let closing = new Date(closingDate);

    try {
        if (closing < today) {
            res.status(400)
                .send( 'Unauthorized' );
        } else if (title === undefined || description === undefined || categoryId === undefined) {
            res.statusMessage = "Bad Request: One or more parameters are not defined";
            res.status(400)
                .send();
        } else if (!(typeof title === 'string') || !(typeof description === 'string') || !(typeof categoryId === 'number')) {
            res.statusMessage = "Bad Request: One or more parameters have the wrong type";
            res.status(400)
                .send();
        } else {
            const result = await petitions.insert(title, description, authorId, categoryId, today, closingDate);
            res.statusMessage = "Created";
            res.status(201)
                .send(result);
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};


exports.view = async function(req, res) {
    console.log( '\nRequest to view a petition...' );
    let petitionId = req.params.id;

    try {
        const [result] = await petitions.getOne(petitionId);
        if( result.length === 0) {
            res.status(404)
                .send('Not Found');
        } else {
            res.status(200)
                .send(result);
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};

exports.edit = async function(req, res) {
    console.log( '\nRequest to edit a petition...' );

    try {
        if (closing < today) {
            res.status(401)
                .send( 'Unauthorized' );
        } else {
            const result = await petitions.insert(title, description, authorId, categoryId, today, closingDate);
            if( result.length === 0) {
                res.status(400)
                    .send('Bad Request');
            } else {
                res.status(200)
                    .send('Petition created!');
            }
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};

exports.delete = async function(req, res) {
    console.log( '\nRequest to delete a petition...' );

    try {
        if (closing < today) {
            res.status(401)
                .send( 'Unauthorized' );
        } else {
            const result = await petitions.insert(title, description, authorId, categoryId, today, closingDate);
            if( result.length === 0) {
                res.status(400)
                    .send('Bad Request');
            } else {
                res.status(200)
                    .send('Petition created!');
            }
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};


exports.listCategories = async function(req, res) {
    console.log( '\nRequest to list categories...' );

    try {
        const result = await petitions.getCategories();
            res.status(200)
                .send(result);
     } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};
