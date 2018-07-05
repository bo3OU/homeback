var express = require('express');
var router = express.Router();
const models = require('./models');
const request = require('request');
const sequelize = require('sequelize');
const op = sequelize.Op;
const jwt = require('jsonwebtoken');

// GET      /hist/:coin/:time/ (time : hour, day, week, month, year, all)
// GET      /coin/:coin/news
// GET      /data/:coin/price
// GET      /search/:string
// GET      /coin/data
// GET      /favs/:user
// DELETE   /fav/:coin/user/:user
// POST      /fav/:coin/user/:user
// POST     /user

function AuthMiddleware(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

function deleteAttributes(body,time){
    body = body.Data;
    var lastValue = "";
    body.forEach(function(v){ 
        delete v.volumefrom
        delete v.volumeto
        delete v.low
        delete v.high
        delete v.open
        var myDate = new Date( v.time *1000);
        if(time == 'hour') {
            v.time = (myDate.getMinutes().toString());
            lastValue == v.time ? v.time = "" : lastValue = v.time ;     
        } else if(time == 'day') {   
            v.time = (myDate.getHours().toString());
            lastValue == v.time ? v.time = "" : lastValue = v.time ;      
        } else if(time == 'week') {
            v.time = (myDate.getDay().toString());
            lastValue == v.time ? v.time = "" : lastValue = v.time ;      
        } else if(time == 'month') {
            v.time = (myDate.getDate().toString());
            lastValue == v.time ? v.time = "" : lastValue = v.time ;
        } else if(time == 'year') {
            v.time = (myDate.getMonth().toString());
            lastValue == v.time ? v.time = "" : lastValue = v.time ;
                  
        }
    });
    return body;
}

router.get('/hist/:coin/:time/', function(req, res) {
    const coinName = req.params.coin.toString().toUpperCase();
    if(req.params.time == "hour")
    {
        request('https://min-api.cryptocompare.com/data/histominute?fsym='+ coinName +'&tsym=USD&limit=30&aggregate=2',{json: true}, (err, response, body) => {
            res.json(deleteAttributes(body,"hour"))
        })
        //144 value for 1 day *10  = 1440 minute
    }
    else if(req.params.time == "day")
    {
        request('https://min-api.cryptocompare.com/data/histominute?fsym='+ coinName +'&tsym=USD&limit=29&aggregate=49',{json: true}, (err, response, body) => {
            res.json(deleteAttributes(body,'day'))
        })
        //144 value for 1 day *10  = 1440 minute
    }
    else if(req.params.time == "week")
    {
        request('https://min-api.cryptocompare.com/data/histohour?fsym='+ coinName +'&tsym=USD&limit=168&aggregate=1',{json: true}, (err, response, body) => {
            res.json(deleteAttributes(body,'week'))
        })
        //168 value for 1 week *1  = 168 hours    
    }
    else if(req.params.time == "month")
    {
        request('https://min-api.cryptocompare.com/data/histohour?fsym='+ coinName +'&tsym=USD&limit=120&aggregate=6',{json: true}, (err, response, body) => {
            res.json(deleteAttributes(body,'month'))
        })
        //120 value for 1 month *6  = 720 hours    
    }
    else if(req.params.time == "year")
    {
        request('https://min-api.cryptocompare.com/data/histoday?fsym='+ coinName +'&tsym=USD&limit=182&aggregate=2',{json: true}, (err, response, body) => {
            res.json(deleteAttributes(body,'year'))
        })
        //  182 value for 1 year *2  = 365 days    
    }
    else 
        res.status(404).json("not found")
})

router.get('/data/:coin/price', function(req, res) {
    request('https://min-api.cryptocompare.com/data/histominute?fsym='+ req.params.coin.toString().toUpperCase() +'&tsym=USD&limit=1',{json: true}, (err, response, body) => {
        
        res.json(body.Data[0]);
    })
})

router.get('/mostchanged', function(req, res) {
    var data = [];
    models.coin.findAll({
        attributes: ['name', 'price', 'change24','id'],
        order: sequelize.literal('change24 DESC'),
        limit: 2,
        raw: true
    }).then(function(coins){
        data = coins;
        models.coin.findAll({
            attributes: ['name', 'price', 'change24'],
            order: sequelize.literal('change24 ASC'),
            limit: 2,
            raw: true
        }).then(function(coinsasc){
            data.push(coinsasc[0]);
            data.push(coinsasc[1]);
            res.json(data);
        })
    })
})

router.get('/search/:name', function(req, res) {
    var name = req.params.name;
    name = unescape(name);
    models.coin.findAll({
        attributes:['id','marketcap','volume','image','prooftype','algorithm','fullname','price','change24'],
        where : 
        {
            fullname: {
                [op.like]: "%" + name + "%"
            }
        },
        limit: 10
    })
    .then(data => res.json(data))
    .catch(error => {
        res.status(500).json("Internal server error");
    })
})

router.get('/coin/:coin', function(req, res) {
    models.coin.findOne({
        attributes:['id','marketcap','volume','image','prooftype','algorithm','fullname','price','change24'],
        where: {name: req.params.coin},
        raw: true
    }).then((coin) => {
        console.log(coin);
        if (coin)
        res.status(200).json(coin);
        else
        res.sendStatus(404);
    }).catch((error) => {
        res.status(500).send('Internal server error');
    })
})

router.get('/coins/data', function(req, res) {
    var offset = req.query.o ? req.query.o : 1;
    var limit = req.query.l ? req.query.l : 100; 
    models.coin.findAndCountAll({
        attributes: ['id','image','price','volume','marketcap','name','fullname'],
         order: sequelize.literal('marketcap DESC'),
        // offset: offset,
         limit: sequelize.literal((offset - 1 )* limit + ","+limit),
        
    }).then((coins) => {
        coins.limit = limit;
        res.json(coins);
    }).catch((error) => {
        res.status(500).send('Internal server error');
    })
})

router.get('/news', function(req, res) {
    var offset = req.query.o ? req.query.o : 1;
    var limit = req.query.l ? req.query.l : 20; 
    //var limit = 20;
    models.news.findAndCountAll({
        // where: {name: req.params.coin},
        // attributes: [],
        // include:[{model: models.news}]
        limit: sequelize.literal((offset - 1 )* limit + ","+ limit),
    }).then(news => {
        news.limit = limit;
        res.json(news)
    })
    .catch(error => {
        res.status(500).json("Internal server error");
    })
})

router.get('/favs', AuthMiddleware, function(req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            //get favorites
            models.user.findAll({
                where: {
                    id: authData.user.id
                },
                attributes:[],
                include: [{ model: models.coin,
                            attributes: ['id'],
                            through: {attributes: []}    
                        }],
               // order: sequelize.literal('marketcap DESC'),
            }).then((coins) => {
                res.status(200).json(coins[0]["coins"]);
            }).catch((error) => {
                res.status(500).send('Internal server error');
            })
        }
    })
})

router.post('/fav/:coin', AuthMiddleware, function(req, res) {
    //add to favorites
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            var result = null;
            models.coin.findOne({
                where : {
                    id : req.params.coin
                }
            }).then(function(coin){
                if(coin) {
                    models.favorites.findOrCreate({
                        where : {
                            coin_id: req.params.coin,
                            user_id: authData.user.id  
                        }
                    })
                    .then(() => { res.json({created: true}) })
                    .catch((err) => { res.status(500).json("Internal server error") })
                }
                else {
                    res.json({"error" : "coin not found"})
                }
            })

        }
    })
})

router.delete('/fav/:coin', AuthMiddleware, function(req, res) {
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            models.favorites.destroy({
                where: {
                    [op.and] : { coin_id: req.params.coin, user_id: authData.user.id }
                }
            })
            .then(() => res.json({destroyed: true}))
            .catch(err=> res.status(500).json("Internal server error : "))
        }
    })
    

})

router.get('/exists/:coin', function(req, res) {
    models.coin.findOne({
        attributes:['id'],
        where: {name: req.params.coin}
    }).then((coin) => {
        if (coin)
            res.sendStatus(200);
        else
            res.sendStatus(404);
    }).catch((error) => {
        res.status(500).send('Internal server error');
    })
})



module.exports = router;


