'use strict';

var db = {};
exports.setDb = function (value) {
    db = value;
};

exports.getAll = function (req, res) {

    db.query('SELECT * FROM ingredients', function (err, rows) {
        if (err) {
            throw err;
        } else {
            res.send(rows);
        }
    });
};

exports.getById = function (req, res) {
    var id = req.params.id;

    db.query('SELECT * FROM ingredients WHERE id = ?', [id], function (err, rows) {
        if (err) {
            throw err;
        } else {
            if (rows.length === 0) {
                res.status(404).send('Resource not found');
            } else {
                res.send(rows[0]);
            }
        }
    });
};

exports.add = function (req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body)),
        data = {
            name: input.name
        };
    db.query('INSERT INTO ingredients set ?', data, function (err, rows) {
        if (err) {
            throw err;
        }
    });
    res.status(201).send('Created');
};

exports.update = function (req, res) {
    // select the item to be deleted
    // if exists delete item , otherwise send 404 (page not found)
    var id = req.params.id,
        input = JSON.parse(JSON.stringify(req.body));
    db.query('SELECT * FROM ingredients WHERE id = ?', [id], function (err, rows) {
        if (err) {
            throw err;
        } else {
            if (rows.length === 0) {
                res.status(404).send('Resource not found');
            } else {
                var data = {
                    name: input.name
                };
                db.query('UPDATE ingredients set ? WHERE id = ?', [data, id], function (err, rows) {
                    if (err) {
                        throw err;
                    } else {
                        res.status(200).send('OK');
                    }
                });
            }
        }
    });
};

exports.remove = function (req, res) {
    // select the item to be deleted
    // if exists delete item , otherwise send 404 (page not found)
    var id = req.params.id;

    db.query('SELECT * FROM ingredients WHERE id = ?', [id], function (err, rows, fields) {
        if (err) {
            throw err;
        } else {
            if (rows.length === 0) {
                res.status(404).send('Resource not found');
            } else {
                db.query('DELETE FROM ingredients WHERE id = ?', [id], function (err, rows) {
                    if (err) {
                        throw err;
                    } else {
                        res.status(200).send('OK');
                    }
                });
            }
        }
    });
};