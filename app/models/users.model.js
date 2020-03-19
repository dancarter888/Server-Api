const db = require('../../config/db');

exports.checkEmail = async function(email) {
    console.log('Request to check email is unique from the database');
    const conn = await db.getPool().getConnection();
    const query = `SELECT * FROM User WHERE User.email = "${email}"`;
    const [result] = await conn.query(query);
    console.log(result);
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