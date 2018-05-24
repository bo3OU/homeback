var express = require('express');
var router = express.Router();
const models = require('./models');
const request = require('request');
const sequelize = require('sequelize');
const op = sequelize.Op;


// /coin/:coin/news
// /data/:coin/price
// /search/:string
// /coin/data
// /favs/:user




router.get('/data/:coin/price', function(req, res) {

    // var date = new Date(Date.now());
    // date.setDate(date.getDate() - 1);
    // console.log(date.getTime());
    //forward link from cryptocompare
    //https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=10
    request('https://min-api.cryptocompare.com/data/histoday?fsym='+ req.params.coin +'&tsym=USD&limit=1',{json: true}, (err, response, body) => {
        console.log(body);
        res.json(body.Data[0]);
    })
})


 // IS NOT WORKING
router.get('/search/:name', function(req, res) {
    models.coin.findAll({
        attributes:['fullname', 'name', 'image'],
        where : 
        {
            [op.or] : {
            fullname: {
                [op.like]: "%" + req.params.name + "%"
            },
            name: {
                [op.like]: "%" + req.params.name + "%"
            }
        }
        }
    })
    .then(data => res.json(data))
    .catch(error => {
        res.status(500).json("Internal server error");
    })
})

router.get('/coin/data', function(req, res) {
    models.coin.findAll({
        attributes: ['image','price','volume','marketcap','name','fullname'],
        //order: ['marketcap', 'DESC'],
        order: sequelize.literal('marketcap DESC'),
        limit: 100
    }).then((coins) => {
        res.status(200).json(coins);
    }).catch((error) => {
        res.status(500).send('Internal server error');
    })
})


router.get('/coin/:coin/news', function(req, res) {
    //get the news of a coin
    models.coin.findAll({
        where: {name: req.params.coin},
        attributes: [],
        include:[{model: models.news}]
    }).then(news => res.json(news))
    .catch(error => {
        res.status(500).json("Internal server error");
    })
})

router.get('/favs/:user', function(req, res) {
    //get favorites
    models.user.findAll({
        where: {
            id: req.params.user
        },
        attributes:[],
        include: [{ model: models.coin,
                    attributes: ['image','price','volume','marketcap','name','fullname'],
                    through: {attributes: []}    
                }],
        order: sequelize.literal('marketcap DESC'),
    }).then((coins) => {
        res.status(200).json(coins);
    }).catch((error) => {
        res.status(500).send('Internal server error');
    })
})

// router.put('/user', function(req, res) {
//     // TODO: authentification
//     console.log("Put /user");
//     models.user
//     .build({
//         login: req.params.login,
//         password: req.params.password,
//         email: req.params.email
//     })
//     .save()
//     .then(res.send(200))
//     .catch(error => {
//         console.log(error)
//         res.send(400)
//     })
// })

// router.delete('/user/:user', function (req, res) {
//     console.log("delete /user/:user");
//     models.user.destroy
// })

module.exports = router;
