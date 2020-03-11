const db = require('../../config/db');

exports.getAll = async function( ) {
    console.log( 'Request to list petitions from the database...' );
    const conn = await db.getPool().getConnection();
    const query = 'select * from Petition';
    const [rows] = await conn.query(query);
    conn.release();
    return rows;
};