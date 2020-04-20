const db = require('../../config/db');

exports.getAll = async function(petitionId) {
    console.log( 'Request to list all signatures of a petition from the database...' );

    const conn = await db.getPool().getConnection();
    const query = `SELECT Signature.signatory_id AS signatoryId, User.name, User.city, User.country, Signature.signed_date AS signedDate
                   FROM Signature JOIN User ON Signature.signatory_id = User.user_id
                   WHERE Signature.petition_id = ${petitionId}
                   ORDER BY signed_date`;
    const [result] = (await conn.query(query));
    conn.release();
    return result;
};

exports.checkSignature = async function(petitionId, signatoryId) {
    console.log( 'Request to list if user with id has signed petition' );

    const conn = await db.getPool().getConnection();
    const query = `SELECT *
                   FROM Signature
                   WHERE Signature.petition_id = ${petitionId} AND Signature.signatory_id = ${signatoryId}`;
    const [result] = (await conn.query(query));
    conn.release();
    return result;
};

exports.checkPetition = async function(petitionId) {
    console.log( 'Request to see if petition exists' );

    const conn = await db.getPool().getConnection();
    const query = `SELECT *
                   FROM Petition
                   WHERE petition_id = ${petitionId}`;
    const [result] = (await conn.query(query));
    conn.release();
    return result;
};

exports.insert = async function(petitionId, signatoryId, signedDate) {
    console.log( 'Request insert signature for a petition' );

    const conn = await db.getPool().getConnection();
    const query = 'INSERT INTO Signature(signatory_id, petition_id, signed_date) VALUES (?)';
    let values = [signatoryId, petitionId, signedDate];
    const [result] = await conn.query(query, [values]);
    conn.release();
};

exports.delete = async function(petitionId, signatoryId) {
    console.log( 'Request to delete a signature from a petition' );

    const conn = await db.getPool().getConnection();
    const query = `DELETE FROM Signature 
                   WHERE signatory_id = ${signatoryId} AND petition_id = ${petitionId}`;
    const [result] = await conn.query(query);
    conn.release();
};