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
// data/:coin/news

router.get('/data/:coin/news', function(req, res) {
    console.log("Get /news " + req.params.coin);
    // TODO : remove coin attributes, let only news' 
    models.coin.findAll({
        where: {name: req.params.coin},
        include:[{model: models.news}]
    })
    .then(news => res.send(news))
})


router.get('/data/:coin/today', function(req, res) {
    var date = new Date(Date.now());
    date.setDate(date.getDate() - 1);
    console.log(date.getTime());
    // TODO : test
    models.coin.findAll({
        where: { name: req.params.coin },
        include:[{
                    model: models.coin_data,
                    where: {
                        [Op.gt]: date.getTime()
                    }
                }]
    })
    .then(data => res.json(data))
})

router.get('/data/:coin/month', function(req, res) {
    var date = new Date(Date.now());
    date.setMonth(date.getMonth() - 1);
    console.log(date.getTime());
    models.coin.findAll({
        where: { name: req.params.coin },
        include:[{
                    model: models.coin_data,
                    where: {
                        [Op.gt]: date.getTime()
                    }
                }]
    })
    .then(data => res.json(data))
})

router.get('/data/:coin/year', function(req, res) {
    var date = new Date(Date.now());
    date.setFullYear(date.getFullYear() - 1);
    console.log(date.getTime());
    models.coin.findAll({
        where: { name: req.params.coin },
        include:[{
                    model: models.coin_data,
                    where: {
                        timestamp:{
                            [Op.gt]: date.getTime()
                        }
                    }
                }]
    })
    .then(data => res.json(data))
})

router.get('/coins', function(req, res) {
    console.log("Get /coins");
    //TODO : remove?
    models.coin.findAll().then((coins) => {
        res.json(coins);
    })
})

router.put('/user', function(req, res) {
    // TODO: authentification
    console.log("Put /user");
    user
    .build({
        login: req.params.login,
        password: req.params.password,
        email: req.params.email
    })
    .save()
    .then(res.send(200))
    .catch(error => {
        console.log(error)
        res.send(400)
    })
})

router.delete('/user/:user', function (req, res) {
    console.log("delete /user/:user");
    models.user.destroy
})

router.get('/coin/:coin', function(req, res) {
    console.log("Get /coin/:coin");
    //add attributes 
    models.coin.max('timestamp',{
        where: { name: req.params.coin },
        include: [{
                model: coin_data
            }]
    })
    .then(data => res.json(data))
})

router.get('/top', function(req, res) {
    console.log("Get /top");
    models.coin.findAll({
        include: [{ model: coin_data}],
        //add attributes
        attributes: [],
        limit : 100
    }).then((coins) => {
        res.status(200).json(coins);
    }).catch((error) => {
        res.status(500).send('Internal server error');
    })
})


module.exports = router;