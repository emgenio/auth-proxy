module.exports = function () {
    var router = require('express').Router({mergeParams: true});

    router.post('/register', (req, res) => {
        res.send('This will register an account');
    });

    return router;
};