var express = require('express');
var router = express.Router();
const models = require('./models');
const sequelize = require('sequelize');

// coins
// top
// coin/:coin
// data/:coin/today
// data/:coin/week
// data/:coin/year
// data/:coin/all
// data/:coin/news
// put /coin -- add to favorites

router.get('/data/:coin/news', function(req, res) {
    models.coin.findAll({
        where: {name: req.params.coin},
        attributes: [],
        include:[{model: models.news}]
    })
    .then(news => res.json(news))
    .catch(error => {
        res.status(500).json("Internal server error");
    })
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
    .catch(error => {
        res.status(500).json("Internal server error");
    })
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
    .catch(error => {
        res.status(500).json("Internal server error");
    })
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
    .catch(error => {
        res.status(500).json("Internal server error");
    })
})


router.get('/data/:coin/all', function(req, res) {
    var date = new Date(Date.now());
    date.setFullYear(date.getFullYear() - 1);
    console.log(date.getTime());
    models.coin.findAll({
        where: { name: req.params.coin },
        include:[{
                    model: models.coin_data
                }]
    })
    .then(data => res.json(data))
    .catch(error => {
        res.status(500).json("Internal server error");
    })
})

// for search purposes
// send the whole thing first and filter later
// or receive a bit and return a filtered result
// depends on the size of data :)

router.get('/coins', function(req, res) {
    console.log("Get /coins");

    models.coin.findAll({
        attributes:['fullname', 'name', 'image']
    }).then((coins) => {
        res.json(coins);
    })
    .catch(error => {
        res.status(500).json("Internal server error");
    })
})


router.get('/coin/:coin', function(req, res) {
    console.log("Get /coin/:coin");
    //add attributes 
    sequelize.query("SELECT * FROM `coin_data` WHERE (`coin_id`,`timestamp`) IN ("
        + " SELECT `coin_id` as cid, MAX(`timestamp`)"
        + "  FROM `coin`"
        + " LEFT OUTER JOIN `coin_data` ON `coin`.`id` = `coin_data`.`coin_id`"
        + "  GROUP BY `coin_id`"
        + ")", { type: sequelize.QueryTypes.SELECT})
    .then(users => {
        console.log(users)
    })

    // SELECT * FROM `coin_data` WHERE (`coin_id`,`timestamp`) IN (
    //     SELECT `coin_id` as cid, MAX(`timestamp`)
    //       FROM `coin`
    //      LEFT OUTER JOIN `coin_data` ON `coin`.`id` = `coin_data`.`coin_id`
    //       GROUP BY `coin_id`
    // )

    models.coin.max('timestamp',{
        where: { name: req.params.coin },
        attributes:[],
        include: [{
                model: models.coin_data,
                where: sequelize
            }]
        }
    )
    .then(data => res.json(data))
    .catch(error => {
        res.status(500).json('Internal server error');
    })
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

router.get('/favs/:user', function(req, res) {
    
    models.user.findAll({
        where: {
            id: req.params.user
        },
        include: [{ model: models.coin}],
        attributes: [],
    }).then((coins) => {
        res.status(200).json(coins);
    }).catch((error) => {
        res.status(500).send('Internal server error');
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
module.exports = router;
