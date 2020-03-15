const db = require('../../config/db');

exports.getAll = async function() {
    console.log( 'Request to list petitions from the database...' );
    const conn = await db.getPool().getConnection();
    const query = 'SELECT * FROM Petition JOIN Signature ON Petition.petition_id=Signature.petition_id GROUP BY Petition.petition_id ORDER BY count(Signature.petition_id) DESC';
    const [rows] = await conn.query(query);
    conn.release();
    return rows;
};

exports.insert = async function(title, description, authorId, categoryId, today, closingDate) {
    console.log('Request to insert a new petition into the database');
    const conn = await db.getPool().getConnection();
    const query = 'INSERT INTO Petition(title, description, author_id, category_id, created_date, closing_date) VALUES (?)';
    let values = [title, description, authorId, categoryId, today, closingDate];
    console.log(values);
    const [result] = await conn.query( query, [values]);
    conn.release();
    return result;
};