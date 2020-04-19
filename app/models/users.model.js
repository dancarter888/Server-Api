const db = require('../../config/db');

exports.checkEmail = async function(email) {
    console.log('Request to check email is unique from the database');
    const conn = await db.getPool().getConnection();
    const query = `SELECT * FROM User WHERE User.email = "${email}"`;
    const [result] = await conn.query(query);
    conn.release();
    return result;
};

exports.insert = async function(name, email, password, city, country) {
    console.log('Request to insert a new user into the database');
    const conn = await db.getPool().getConnection();
    const query = 'INSERT INTO User(name, email, password, auth_token, city, country, photo_filename) VALUES (?)';
    let values = [name, email, password, null, city, country, null];
    const [result] = await conn.query(query, [values]);
    const [userId] = await conn.query('SELECT User.user_id AS userId FROM User WHERE user_id = (SELECT max(user_id) FROM User)');
    conn.release();
    return userId;
};

exports.checkUser = async function(email, password) {
    console.log(`Request to check user with email ${email} and password ${password}`);
    const conn = await db.getPool().getConnection();
    const query = `SELECT user_id 
                   FROM User 
                   WHERE email = "${email}" AND password = "${password}"`;
    const [userId] = await conn.query(query);
    conn.release();
    return userId;
};

exports.insertToken = async function(token, userId) {
    console.log(`Request to insert token for correct user into database`);
    const conn = await db.getPool().getConnection();
    const query = `UPDATE User
                   SET auth_token = "${token}"
                   WHERE user_id = ${userId}`;
    const [result] = await conn.query(query);

    const [returnVal] = await conn.query(`SELECT user_id AS userId, auth_token AS token
                                          FROM User
                                          WHERE user_id = ${userId}`);
    conn.release();
    return returnVal;
};

exports.removeToken = async function(userId) {
    console.log(`Request to remove token for correct user into database`);
    const conn = await db.getPool().getConnection();
    const query = `UPDATE User
                   SET auth_token = null
                   WHERE user_id = ${userId}`;
    const [result] = await conn.query(query);
    conn.release();
};

exports.getOne = async function(reqUserId, authenticatedUserId) {
    console.log(`Request to view a user from the database`);
    const conn = await db.getPool().getConnection();
    const query = `SELECT name , city, country, email
                   FROM User
                   WHERE user_id = ${reqUserId}`;
    const [result] = (await conn.query(query))[0];
    console.log("result", result);
    conn.release();
    if (!result) {
        return null
    }
    if (reqUserId === authenticatedUserId) {
        return {
            "name": result.name,
            "city": result.city,
            "country": result.country,
            "email": result.email
        };
    } else {
        return {
            "name": result.name,
            "city": result.city,
            "country": result.country
        };
    }
};

exports.getOneForChange = async function(authenticatedUserId) {
    console.log(`Request to view a user from the database`);
    const conn = await db.getPool().getConnection();
    const query = `SELECT name, email, password, city, country
                   FROM User
                   WHERE user_id = ${authenticatedUserId}`;
    const [result] = (await conn.query(query))[0];
    console.log("result", result);
    conn.release();

    return result;
};

exports.changeUser = async function(reqUserId, name, email, password, city, country) {
    console.log(`Request to view a user from the database`);
    const conn = await db.getPool().getConnection();
    const query = `UPDATE User 
                   SET name = "${name}",email = "${email}", password = "${password}", city = "${city}", country = "${country}"
                   WHERE user_id = "${reqUserId}"`;
    const result = (await conn.query(query))[0];
    console.log(result);
    conn.release();
};