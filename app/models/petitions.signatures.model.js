const db = require('../../config/db');

exports.getAll = async function(petitionId) {
    console.log( 'Request to list all signatures of a petition from the database...' );

    const conn = await db.getPool().getConnection();
    const query = `SELECT Signature.signatory_id AS signatoryId, User.name, User.city, User.country, Signature.signed_date AS signedDate
                   FROM Signature JOIN User ON Signature.signatory_id = User.user_id
                   WHERE Signature.petition_id = ${petitionId}`;
    console.log(query);
    const [result] = (await conn.query(query));
    conn.release();
    return result;
};