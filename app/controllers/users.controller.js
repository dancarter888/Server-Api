const users = require('../models/users.model');

exports.register = async function(req, res) {
    console.log( '\nRequest to register a new user...' );

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

    try {
        let emailCheck = await users.checkEmail(email);
        if(email === undefined || !(email.includes("@")) || emailCheck.length !== 0 || name === undefined || password === undefined || password === "") {
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
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status( 500 )
            .send();
    }
};

exports.login = async function(req, res) {
    console.log( '\nRequest to login a user...' );
    let email = req.body.email;
    let password = req.body.password;

    try {
        const loginUser = (await users.checkUser(email, password))[0];
        if( loginUser === undefined) {
            res.statusMessage = "Bad Request";
            res.status(400)
                .send();
        } else {
            let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const result = (await users.insertToken(token, loginUser.user_id))[0];
            res.statusMessage = "OK";
            res.status(200)
                .send(result);
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};

exports.logout = async function(req, res) {
    let userId = req.authenticatedUserId;
    console.log( '\nRequest to logout a user...' );

    try {
        await users.removeToken(userId);
        res.statusMessage = "OK";
        res.status(200)
            .send();
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};

exports.view = async function(req, res) {
    let authenticatedUserId = req.authenticatedUserId;
    let reqUserId = req.params.id;
    console.log( '\nRequest to view a user...' );

    try {
        const result = await users.getOne(reqUserId, authenticatedUserId);
        if (result === null) {
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

exports.change = async function(req, res) {
    let authenticatedUserId = req.authenticatedUserId;
    let reqUserId = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let currentPassword = req.body.currentPassword;
    let city = req.body.city;
    let country = req.body.country;
    let changeValues = [];
    console.log( '\nRequest to view a user...' );

    try {
        const result = await users.getOneForChange(authenticatedUserId);
        if (reqUserId !== authenticatedUserId) {
            res.statusMessage = "Forbidden";
            res.status(403)
                .send();
        } else if (!(await checkChangeValidity(authenticatedUserId, email, password, currentPassword))
            || req.params.length === 0
            || currentPassword !== result.password) {

            res.statusMessage = "Bad Request";
            res.status(400)
                .send();
        } else {

            //Name
            if (name === undefined) {
                changeValues.push(result.name);
            } else {
                changeValues.push(name);
            }
            //Email
            if (email === undefined) {
                changeValues.push(result.email);
            } else {
                changeValues.push(email);
            }
            //Password
            if (password === undefined) {
                changeValues.push(result.password);
            } else {
                changeValues.push(password);
            }
            //City
            if (city === undefined) {
                changeValues.push(result.city);
            } else {
                changeValues.push(city);
            }
            //Country
            if (country === undefined) {
                changeValues.push(result.country);
            } else {
                changeValues.push(country);
            }

            const change = await users.changeUser(authenticatedUserId, changeValues[0], changeValues[1], changeValues[2], changeValues[3], changeValues[4]);

            res.statusMessage = "OK";
            res.status(200)
                .send();
        }
    } catch( err ) {
        res.status( 500 )
            .send( 'Internal Server Error');
    }
};

checkChangeValidity = async function(authenticatedUserId, email, password, currentPassword) {
    //Email Check
    let emailCheck = await users.checkEmail(email);
    if (email !== undefined && (!(email.includes("@")) || (emailCheck.length !== 0 && (emailCheck[0].user_id).toString() !== authenticatedUserId))) {
        console.log("email ERROR");
        return false;
    //Empty password check
    } else if (password === "") {
        console.log("empty password ERROR");
        return false;
    //currentPassword inclusion check
    } else if (password !== undefined && currentPassword === undefined) {
        console.log("new password given but old password not given ERROR");
        return false;
    } else {
        console.log("VALID");
        return true;
    }
};
