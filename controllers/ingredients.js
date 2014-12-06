'use strict';
var db = {};
exports.set_db = function (value) {
    db = value;
};

exports.getAll = function (req, res) {
    var queryString = 'SELECT * FROM ingredients';

    db.query(queryString, function (err, rows, fields) {
        if (err) throw err;

        res.send(rows);
    });
};

exports.getById = function (req, res) {
    var queryString = 'SELECT * FROM ingredients WHERE id = ?';

    db.query(queryString, [req.params.id], function (err, rows, fields) {
        if (err) throw err;

        res.send(rows);
    });
};

exports.add = function (req, res) {

};

exports.update = function (req, res) {

};

exports.remove = function (req, res) {

};