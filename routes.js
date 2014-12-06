module.exports = function (app, connection) {
    'use strict';
    var ingredients = require('./controllers/ingredients');
    ingredients.set_db(connection);

    app.get('/api/ingredients', ingredients.getAll);
    app.get('/api/ingredients/:id', ingredients.getById);
    app.post('/api/ingredients', ingredients.add);
    app.put('/api/ingredients', ingredients.update);
    app.delete('/api/ingredients', ingredients.remove);
};