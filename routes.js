var express = require('express');
var router = express.Router();
const models = require('./models');

// coins
// top
// coin/:coin
// data/:coin/today
// data/:coin/week
// data/:coin/year
// data/:coin/all


router.get('/coins', function(req, res) {
    console.log("/coins");
    models.coin.findAll().then((coins) => {
        res.json(coins);
    })
})

router.put('/user', function(req, res) {
    models.user.create(req.params.user);    
})

router.delete('/user/:user', function (req, res) {
    models.user.destroy
})
router.get('/user', function(req, res) {

    models.coin.findAll().then(function(coin){
        console.log(coin)
    })
    res.send("salam");
})


router.get('/coin/:coin', function(req, res) {

    models.coin.findAll().then(function(coin){
        console.log(coin)
    })
    res.send("salam");
})


router.get('/top', function(req, res) {

    models.coin.findAll().then(function(coin){
        console.log(coin)
    })
    res.send("salam");
})

module.exports = router;