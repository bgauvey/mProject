module.exports = function (router, connection) {
    "use strict";

    var ingredientsController = require('../controllers/ingredients');
    ingredientsController.set_db(connection);
    
    // things that call the path
    router
        .route('/ingredients/')
            .get(ingredientsController.getAll)
            .post(ingredientsController.add);
    
    // things that call the path with an id
    router
        .route('/ingredients/:id')
            .get(ingredientsController.getById)
            .put(ingredientsController.update)
            .delete(ingredientsController.remove);
};