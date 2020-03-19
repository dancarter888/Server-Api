const users = require('../models/users.model');

exports.register = async function(req, res) {
    console.log( '\nRequest to register a new user...' );

    //Make city and country optional fields
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let city = null;
    if (req.body.city !== undefined) {
        city = req.body.city;
    }
    let country = null;
    if (req.body.country !== undefined) {
        country = req.body.country;
    }
    console.log("req.body", req.body);
    console.log(country, city);

    try {
        let emailCheck = await users.checkEmail(email);
        if(!(email.includes("@")) || emailCheck.length !== 0) {
            res.statsMessage = "Bad Request";
            res.status(400)
                .send();
        } else {
            const [result] = await users.insert(name, email, password, city, country);
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
