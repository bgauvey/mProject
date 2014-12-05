module.exports = function (app) {
    'use strict';
    var ingredients = require('./controllers/ingredients');
    app.get('/ingredients', ingredients.getAll);
    app.get('/ingredients/:id', ingredients.getById);
    app.post('/ingredients', ingredients.add);
    app.put('/ingredients', ingredients.update);
    app.delete('/ingredients', ingredients.remove);
};