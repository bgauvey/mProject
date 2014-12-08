module.exports = function (router, connection) {
    "use strict";

    var ingredientsController = require('../controllers/ingredients');
    ingredientsController.set_db(connection);

    router
        .route('/ingredients/')
            .get(ingredientsController.getAll)
            .post(ingredientsController.add);
    router
        .route('/ingredients/:id')
            .get(ingredientsController.getById)
            .put(ingredientsController.update)
            .delete(ingredientsController.remove);
};