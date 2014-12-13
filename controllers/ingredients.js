"use strict";

var db = {};
exports.set_db = function (value) {
    db = value;
};

exports.getAll = function (req, res) {
    var queryString = 'SELECT * FROM ingredients';

    db.query(queryString, function (err, rows, fields) {
        if (err) {
            throw err;
        } else {
            res.send(rows);
        }
    });
};

exports.getById = function (req, res) {
    var queryString = 'SELECT * FROM ingredients WHERE id = ?';

    db.query(queryString, [req.params.id], function (err, rows, fields) {
        if (err) {
            throw err;
        } else {
            if (rows.length === 0) {
                res.status(404).send("Resource not found");
            } else {
                res.send(rows[0]);
            }
        }
    });
};

exports.add = function (req, res, next) {
    var queryString = 'INSERT INTO ingredients SET ?';
    db.query(queryString, req.body, function (err, result) {
        if (err) {
            throw err;
        } 
     });
    res.status(201).send("Created");
};

exports.update = function (req, res) {
    // select the item to be deleted
    // if exists delete item , otherwise send 404 (page not found)
    var queryString = 'SELECT * FROM ingredients WHERE id = ?';

    db.query(queryString, [req.params.id], function (err, rows, fields) {
        if (err) {
            throw err;
        } else {
            if (rows.length === 0) {
                res.status(404).send("Resource not found");
            } else {
                queryString = 'UPDATE ingredients SET ?';
                db.query(queryString, req.body, function (err, rows, fields) {
                if (err)
                    throw err;
                res.status(200).send("OK"); 
            }
        }
    });
};

exports.remove = function (req, res) {
    // select the item to be deleted
    // if exists delete item , otherwise send 404 (page not found)
    var queryString = 'SELECT * FROM ingredients WHERE id = ?';

    db.query(queryString, [req.params.id], function (err, rows, fields) {
        if (err) {
            throw err;
        } else {
            if (rows.length === 0) {
                res.status(404).send("Resource not found");
            } else {
                queryString = 'DELETE FROM ingredients WHERE id = ?';
                db.query(queryString, [req.params.id], function (err, rows, fields) {
                if (err)
                    throw err;
                res.status(200).send("OK"); 
            }
        }
    });
};