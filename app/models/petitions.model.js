const db = require('../../config/db');

exports.getAll = async function(q, categoryId, authorId, sortBy) {
    console.log( 'Request to list petitions from the database...' );
    let searchTerm = 1;
    let categoryTerm = 1;
    let authorTerm = 1;

    if (q !== undefined) {
        searchTerm = "Petition.title LIKE \"%" + q + "%\"";
    }

    if (categoryId !== undefined) {
        categoryTerm = "Petition.category_id = " + categoryId;
    }

    if (authorId !== undefined) {
        authorTerm = "Petition.author_id = " + authorId;
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
    } else {
        return null;
    }

    const conn = await db.getPool().getConnection();
    const query = `SELECT Petition.petition_id AS petitionId, Petition.title AS title, Category.name AS category, User.name AS authorName, count(Signature.petition_id) AS signatureCount
                   FROM ((Petition LEFT JOIN Signature ON Petition.petition_id=Signature.petition_id) 
                   JOIN Category ON Petition.category_id = Category.category_id) 
                   JOIN User ON Petition.author_id = User.user_id
                   WHERE ${searchTerm} AND ${categoryTerm} AND ${authorTerm}
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
    return {
        "petitionId": result.insertId
    };
};

exports.getOne = async function(petitionId) {
    console.log('Request to view one petition from the database');
    const conn = await db.getPool().getConnection();
    const query = `SELECT Petition.petition_id AS petitionId, Petition.title AS title, Category.name AS category, User.name AS authorName, count(Signature.petition_id) AS signatureCount,
                   Petition.description AS description, Petition.author_id AS authorId, User.city AS authorCity, User.country AS authorCountry, Petition.created_date AS createdDate,
                   Petition.closing_date AS closingDate
                   FROM ((Petition LEFT JOIN Signature ON Petition.petition_id=Signature.petition_id) 
                   JOIN Category ON Petition.category_id = Category.category_id) 
                   JOIN User ON Petition.author_id = User.user_id
                   WHERE Petition.petition_id = ${petitionId}`;
    console.log(query);
    const [result] = await conn.query(query);
    conn.release();
    return result;
};

exports.getCategories = async function() {
    console.log('Request to view categories from the database');
    const conn = await db.getPool().getConnection();
    const query = `SELECT category_id AS categoryId, name AS name 
                   FROM Category`;
    console.log(query);
    const result = (await conn.query(query))[0];
    conn.release();
    return result;
};

exports.checkCategoryId = async function(categoryId) {
    console.log('Request to view categories from the database');
    const conn = await db.getPool().getConnection();
    const query = `SELECT category_id
                   FROM Category
                   WHERE category_id = ${categoryId}`;
    console.log(query);
    const result = (await conn.query(query))[0];
    conn.release();
    return result;
};

exports.update = async function(petitionId, title, description, categoryId, closingDate) {
    console.log('Request to update a petition in the database');
    let titleTerm = "";
    let descriptionTerm = "";
    let categoryIdTerm = "";
    let closingDateTerm = "";

    if (title !== undefined) {
        titleTerm = `, title = '${title}'`
    }
    if (description !== undefined) {
        descriptionTerm = `, description = '${description}'`
    }
    if (categoryId !== undefined) {
        categoryIdTerm = `, category_id = '${categoryId}'`
    }
    if (closingDate !== undefined) {
        closingDateTerm = `, closing_date = '${closingDate}'`
    }

    console.log(titleTerm, descriptionTerm, categoryIdTerm, closingDateTerm);

    const conn = await db.getPool().getConnection();
    const query = `Update Petition 
                   SET petition_id = petition_id ${titleTerm} ${descriptionTerm} ${categoryIdTerm} ${closingDateTerm}
                   WHERE petition_id = ${petitionId}`;
    console.log(query);
    const [result] = await conn.query(query);
    conn.release();
};

exports.deletePetition = async function(petitionId) {
    console.log('Request to delete petition from the database');
    const conn = await db.getPool().getConnection();
    const query = `DELETE
                   FROM Petition
                   WHERE petition_id = ${petitionId}`;
    console.log(query);
    const result = (await conn.query(query))[0];
    conn.release();
};

exports.deleteSignatures = async function(petitionId) {
    console.log('Request to delete signatures from the database');
    const conn = await db.getPool().getConnection();
    const query = `DELETE
                   FROM Signature
                   WHERE petition_id = ${petitionId}`;
    console.log(query);
    const result = (await conn.query(query))[0];
    conn.release();
};