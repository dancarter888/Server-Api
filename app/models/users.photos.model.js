const db = require('../../config/db');
const photosDirectory = 'storage/photos/';
const fs = require('mz/fs');
const mime = require('mime-types');

exports.getOne = async function(userId) {
    console.log( 'Request to get hero image filename from a user from the database...' );

    const conn = await db.getPool().getConnection();
    const query = `SELECT photo_filename
                   FROM User
                   WHERE user_id = ${userId}`;
    console.log(query);
    const [result] = (await conn.query(query))[0];
    conn.release();
    if (result === undefined) {
        return null;
    } else if (result.photo_filename === null) {
        return null;
    }

    console.log(result);
    console.log(result.photo_filename);

    if (await fs.exists(photosDirectory + result.photo_filename)) {
        const image = await fs.readFile(photosDirectory + result.photo_filename);
        const mimeType = mime.lookup(result.photo_filename);
        return {image, mimeType};
    } else {
        return null;
    }
};