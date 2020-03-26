const db = require('../../config/db');
const photosDirectory = 'storage/photos/';
const fs = require('mz/fs');
const mime = require('mime-types');

exports.getOne = async function(petitionId) {
    console.log( 'Request to get hero image filename from a petition from the database...' );

    const conn = await db.getPool().getConnection();
    const query = `SELECT photo_filename
                   FROM Petition
                   WHERE petition_id = ${petitionId}`;
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

exports.checkAuthor = async function(petitionId) {
    console.log( 'Check author of a petition' );

    const conn = await db.getPool().getConnection();
    const query = `SELECT author_id
                   FROM Petition
                   WHERE petition_id = ${petitionId}`;
    const [result] = (await conn.query(query))[0];
    conn.release();
    return result.author_id;
};

exports.checkImage = async function(petitionId) {
    console.log( 'Check image of a petition' );

    const conn = await db.getPool().getConnection();
    const query = `SELECT photo_filename
                   FROM Petition
                   WHERE petition_id = ${petitionId}`;
    const [result] = (await conn.query(query))[0];
    conn.release();
    if (result.photo_filename === null) {
        return null;
    } else {
        return result.photo_filename;
    }
};

exports.updateImage = async function(petitionId, filename) {
    console.log( 'Insert image of a petition' );

    const conn = await db.getPool().getConnection();
    const query = `UPDATE Petition
                   SET photo_filename = "${filename}"
                   WHERE petition_id = ${petitionId}`;
    const [result] = (await conn.query(query));
    conn.release();
};