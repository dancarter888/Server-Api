const petitions = require('../models/petitions.model');


categoryCheck = async function(categoryId) {
    const result = await petitions.checkCategoryId(categoryId);
    if (result.length === 0) {
        return false;
    } else {
        return true;
    }
};

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

        if (result === null) {
            res.statusMessage = 'Bad Request';
            res.status(400)
                .send();
        } else {
            if (startIndex === undefined) {
                startIndex = 0;
            }
            if (count === undefined) {
                count = result.length;
            }

            console.log(result, result.length);

            if (result.length !== 0) {
                for (let i = 0; i < count; i++) {
                    console.log(startIndex);
                    if ((startIndex) >= result.length) {
                        break;
                    }
                    console.log(result[startIndex]);
                    returnedResults.push(result[startIndex]);
                    startIndex++;
                }
                res.statusMessage = 'OK';
                res.status(200)
                    .send(returnedResults);
            } else {
                res.statusMessage = 'OK';
                res.status(200)
                    .send(returnedResults);
            }
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
            res.statusMessage = "Bad Request: Closing date not in the future";
            res.status(400)
                .send();
        } else if (title === undefined || description === undefined || categoryId === undefined) {
            res.statusMessage = "Bad Request: One or more parameters are not defined";
            res.status(400)
                .send();
        } else if (!(typeof title === 'string') || !(typeof description === 'string') || !(typeof categoryId === 'number') || !(typeof closingDate === 'string')) {
            res.statusMessage = "Bad Request: One or more parameters have the wrong type";
            res.status(400)
                .send();
        } else if (!(await categoryCheck(categoryId))) {
            res.statusMessage = "Bad Request: CategoryId does not match an existing category";
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
};

exports.edit = async function(req, res) {
    console.log( '\nRequest to edit a petition...' );
    let petitionId = req.params.id;
    let title = req.body.title;
    let description = req.body.description;
    let categoryId = req.body.categoryId;
    let closingDate = req.body.closingDate;
    let today = new Date();
    let closing = new Date(closingDate);
    let authorId = req.authenticatedUserId;

    try {
        if (closing < today) {
            res.statusMessage = "Bad Request: Closing date not in the future";
            res.status(400)
                .send();
        } else {

            const [petitionInfo] = await petitions.getOne(petitionId);
            let oldClosingDate = new Date(petitionInfo.closingDate);
            console.log(petitionInfo.authorId.toString(), authorId);

            if (petitionInfo.authorId.toString() !== authorId) {
                res.statusMessage = "Forbidden";
                res.status(403)
                    .send();

            /*} else if (oldClosingDate < today) { //If petition closed
                res.statusMessage = "Bad Request: Petition has closed";
                res.status(400)
                    .send();*/

            } else if ((title !== undefined && !(typeof title === 'string'))
                || (description !== undefined && !(typeof description === 'string'))
                || (categoryId !== undefined && !(typeof categoryId === 'number'))
                || (closingDate !== undefined && !(typeof closingDate === 'string'))) {
                res.statusMessage = "Bad Request: One or more parameters have the wrong type";
                res.status(400)
                    .send();
            } else if (categoryId !== undefined && !(await categoryCheck(categoryId))) {
                res.statusMessage = "Bad Request: CategoryId does not match an existing category";
                res.status(400)
                    .send();
            } else {
                const result = await petitions.update(petitionId, title, description, categoryId, closingDate);
                res.statusMessage = "OK";
                res.status(200)
                    .send();
            }
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};

exports.remove = async function(req, res) {
    console.log( '\nRequest to delete a petition...' );
    let petitionId = req.params.id;
    let authenticatedUserId = req.authenticatedUserId;

    try {
        const [result] = await petitions.getOne(petitionId);
        if( result.petitionId === null) {
            res.statusMessage = "Not Found";
            res.status(404)
                .send();
        } else if (result.authorId.toString() !== authenticatedUserId) {
            res.statusMessage = "Forbidden";
            res.status(403)
                .send();
        } else {
            const result1 = await petitions.deletePetition(petitionId);
            const result2 = await petitions.deleteSignatures(petitionId);
            res.statusMessage = "OK";
            res.status(200)
                .send();
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

