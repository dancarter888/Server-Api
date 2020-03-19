const users = require('../models/users.model');

exports.register = async function(req, res) {
    console.log( '\nRequest to register a new user...' );

    //Make city and country optional fields
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let city = req.body.city;
    let country = req.body.country;

    try {
        let emailCheck = await users.checkEmail(email);
        if(!(email.includes("@")) || emailCheck.length !== 0) {
            res.status(400)
                .send('Bad Request');
        } else {
            const result = await users.insert(name, email, password, city, country);
            res.status(201)
                .send(result);
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};


exports.login = async function(req, res) {
    console.log( '\nRequest login a user...' );
    let petitionId = req.params.id;

    try {
        const result = await users.getOne(petitionId);
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
