exports.getAll = function (req, res) {
    res.send([{
        "id" : 1,
        "name" : "Wheat"
    }]);
};

exports.getById = function (req, res) {
    console.log(req.params.id);
};

exports.add = function (req, res) {
    
};

exports.update = function (req, res) {
    
};

exports.remove = function (req, res) {
    
};