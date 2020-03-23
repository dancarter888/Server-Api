const db = require('../../config/db');

exports.getAll = async function(petitionId) {
    console.log( 'Request to list all signatures of a petition from the database...' );

    const conn = await db.getPool().getConnection();
    const query = `SELECT Signature.signatory_id AS signatoryId, User.name, User.city, User.country, Signature.signed_date AS signedDate
                   FROM Signature JOIN User ON Signature.signatory_id = User.user_id
                   WHERE Signature.petition_id = ${petitionId}
                   ORDER BY signed_date`;
    console.log(query);
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
    console.log(query);
    const [result] = (await conn.query(query));
    conn.release();
    return result;
};

exports.insert = async function(petitionId, signatoryId, signedDate) {
    console.log( 'Request to list if user with id has signed petition' );

    const conn = await db.getPool().getConnection();
    const query = 'INSERT INTO Signature(signatory_id, petition_id, signed_date) VALUES (?)';
    console.log(query);
    let values = [signatoryId, petitionId, signedDate];
    const [result] = await conn.query(query, [values]);
    console.log(result);
    conn.release();
};