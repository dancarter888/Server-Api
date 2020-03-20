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
        if(!(email.includes("@")) || emailCheck.length !== 0 || password === undefined) {
            res.statusMessage = "Bad Request";
            res.status(400)
                .send();
        } else {
            const [result] = await users.insert(name, email, password, city, country);
            res.statusMessage = "Created";
            res.status(201)
                .send(result);
        }
    } catch( err ) {
        res.statusMessage = "Internal Server Error";
        res.status( 500 )
            .send( );
    }
};


exports.login = async function(req, res) {
    console.log( '\nRequest to login a user...' );
    let email = req.body.email;
    let password = req.body.password;

    try {
        const loginUser = (await users.checkUser(email, password))[0];
        if( loginUser.length === 0) {
            res.statusMessage = "Bad Request";
            res.status(400)
                .send();
        } else {
            let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            console.log("vals:", email, password, token, loginUser.user_id);
            const result = (await users.insertToken(token, loginUser.user_id))[0];
            console.log("result:", result, result.userId, result.token);
            res.statusMessage = "OK";
            res.status(200)
                .send(result);
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};
