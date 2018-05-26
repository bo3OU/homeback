var express = require('express');
var router = express.Router();
const models = require('./models');
const request = require('request');
const sequelize = require('sequelize');
const op = sequelize.Op;

// GET      /hist/:coin/:time/ (time : day, week, month, year, all)
// GET      /coin/:coin/news
// GET      /data/:coin/price
// GET      /search/:string
// GET      /coin/data
// GET      /favs/:user
// DELETE   /fav/:coin/user/:user
// POST      /fav/:coin/user/:user
// POST     /user


router.get('/hist/:coin/:time/', function(req, res) {
    console.log(req.params.time);
    console.log(req.params.coin);
    
    if(req.params.time == "day")
    {
        request('https://min-api.cryptocompare.com/data/histominute?fsym='+ req.params.coin +'&tsym=USD&limit=48&aggregate=30',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //48 value for 1 day *30  = 1440 minute
    }
    else if(req.params.time == "week")
    {
        request('https://min-api.cryptocompare.com/data/histohour?fsym='+ req.params.coin +'&tsym=USD&limit=84&aggregate=2',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //84 value for 1 week *2  = 168 hours    
}
    else if(req.params.time == "month")
    {
        request('https://min-api.cryptocompare.com/data/histohour?fsym='+ req.params.coin +'&tsym=USD&limit=144&aggregate=5',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //144 value for 1 month *5  = 720 hours    
}
    else if(req.params.time == "year")
    {
        request('https://min-api.cryptocompare.com/data/histoday?fsym='+ req.params.coin +'&tsym=USD&limit=182&aggregate=2',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //  182 value for 1 year *2  = 365 days    
}
    else if(req.params.time == "all")
    {
        request('https://min-api.cryptocompare.com/data/histoday?fsym='+ req.params.coin +'&tsym=USD&aggregate=10',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //72 value for 1 day * 10  = 2000 VALUE    
}
    else 
        res.status(404).json("not found")
})

router.post('/coin/:coin', (req, res) => {

})

router.get('/data/:coin/price', function(req, res) {
    console.log(req.query)
    //get it from database doe ...

    // var date = new Date(Date.now());
    // date.setDate(date.getDate() - 1);
    // console.log(date.getTime());

    //forward link from cryptocompare
    //https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=10
    request('https://min-api.cryptocompare.com/data/histoday?fsym='+ req.params.coin.toString().toUpperCase() +'&tsym=USD&limit=1',{json: true}, (err, response, body) => {
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

router.post('/fav/:coin/user/:user', function(req, res) {
    //add to favorites
    var result = null;
    models.favorites.build({
        coin_id: req.params.coin,
        user_id: req.params.user  
    })
    .save()
    .then(() => { res.json({created: true}) })
    .catch((err) => { res.status(500).json("Internal server error") })
})


router.delete('/fav/:coin/user/:user', function(req, res) {
    //add to favorites
    var result = null;
    models.favorites.destroy({
        where: {
            [op.and] : {
                coin_id: req.params.coin,
                user_id: req.params.user
            }
        }
    })
    .then(() => res.json({destroyed: true}))
    .catch(err=> res.status(500).json("Internal server error : "))
})

router.post('/user', function(req, res) {
    // TODO: authentification
    models.user.findOne({
        where: {
            [op.or]: {
                login: req.body.login,
                email: req.body.email
            }
        }
    })
    .then((user)=> {
        if(user){
            res.status(400).json("already created")
        }
        else {
            models.user.create({
                login: req.body.login,
                email: req.body.email,
                password: req.body.password
            }).then(() => res.status(200).json("created"))
            .catch((err) => res.status(500).json("Internal server error"))
        }
    })
    .catch((err) => res.status(500).json("Internal server error"))
})






module.exports = router;
