const petitionsSignatures = require('../models/petitions.signatures.model');
const petitions = require('../models/petitions.model');

exports.list = async function(req, res) {
    console.log( '\nRequest to list signatures of a petition...' );
    let petitionId = req.params.id;

    try {
        const result = await petitionsSignatures.getAll(petitionId);

        if(result.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404)
                .send();
        } else {
            res.statusMessage = "OK";
            res.status(200)
                .send(result);
        }

    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status( 500 )
            .send();
    }
};

exports.sign = async function(req, res) {
    console.log( '\nRequest to list signatures of a petition...' );
    let petitionId = req.params.id;
    let authenticatedUserId  = req.authenticatedUserId;
    let today = new Date();

    try {
        const [result1] = await petitions.getOne(petitionId);

        if(result1.petitionId !== null) {
            var oldClosingDate = new Date(result1.closingDate);
        }
        if(result1.petitionId === null) {
            res.statusMessage = "Not Found";
            res.status(404)
                .send();
        } else if ((result1.closingDate !== null) && oldClosingDate < today) { //If petition closed
            res.statusMessage = "Forbidden: Petition has closed";
            res.status(403)
                .send();
        } else {
            let [result2] = await petitionsSignatures.checkSignature(petitionId, authenticatedUserId);

            if (result2 !== undefined) {
                res.statusMessage = "Forbidden: user has already signed this petition";
                res.status(403)
                    .send();
            } else {
                let result3 = await petitionsSignatures.insert(petitionId, authenticatedUserId, today);
                res.statusMessage = "Created";
                res.status(201)
                    .send();
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
    console.log( '\nRequest to remove signature of a petition...' );
    let petitionId = req.params.id;
    let authenticatedUserId  = req.authenticatedUserId;

    try {
        let [result1] = await petitionsSignatures.checkPetition(petitionId);
        if (result1 === undefined) {
            res.statusMessage = "Not Found";
            res.status(404)
                .send();
        } else {
            let [result2] = await petitionsSignatures.checkSignature(petitionId, authenticatedUserId);

            if (result2 !== undefined) {
                let result3 = petitionsSignatures.delete(petitionId, authenticatedUserId);
                res.statusMessage = "OK";
                res.status(200)
                    .send();
            } else {
                res.statusMessage = "Forbidden: user user signature does not exist";
                res.status(403)
                    .send();
            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status( 500 )
            .send();
    }
};