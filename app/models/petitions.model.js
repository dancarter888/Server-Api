const db = require('../../config/db');

exports.getAll = async function(q, categoryId, authorId, sortBy) {
    console.log( 'Request to list petitions from the database...' );
    let where = "";

    if (q !== undefined) {
        let searchTerm = "\"%" + q + "%\"";
        where += "WHERE Petition.title LIKE " + searchTerm;
    }

    if (categoryId !== undefined) {
        if (where !== "") {
            where += " AND "
        } else {
            where = "WHERE "
        }
        where += "Petition.category_id = " + categoryId;
    }

    if (authorId !== undefined) {
        if (where !== "") {
            where += " AND "
        } else {
            where = "WHERE "
        }
        where += "Petition.author_id = " + authorId;
    }

    let sortTerm = "ORDER BY count(Signature.petition_id) DESC";
    if (sortBy === "ALPHABETICAL_ASC") {
        sortTerm = "ORDER BY Petition.title ASC";
    } else if (sortBy === "ALPHABETICAL_DESC") {
        sortTerm = "ORDER BY Petition.title DESC";
    } else if (sortBy === "SIGNATURES_ASC") {
        sortTerm = "ORDER BY count(Signature.petition_id) ASC";
    } else if (sortBy === "SIGNATURES_DESC") {
        sortTerm = "ORDER BY count(Signature.petition_id) DESC";
    }

    const conn = await db.getPool().getConnection();
    //Change to include petitions without signatures
    const query = `SELECT Petition.petition_id, Petition.title, Petition.category_id, Petition.author_id, count(Petition.petition_id) AS signatureCount
                   FROM Petition JOIN Signature ON Petition.petition_id=Signature.petition_id 
                   ${where} 
                   GROUP BY Petition.petition_id 
                   ${sortTerm}`;
    console.log(query);
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
    console.log(query, [values]);
    const [result] = await conn.query(query, [values]);
    conn.release();
    return result;
};