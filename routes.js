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

router.get('/hist/:coin/:time/', function(req, res) {
    const coinName = req.params.coin.toString().toUpperCase();
    if(req.params.time == "day")
    {
        request('https://min-api.cryptocompare.com/data/histominute?fsym='+ coinName +'&tsym=USD&limit=60&aggregate=1',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //144 value for 1 day *10  = 1440 minute
    }
    else if(req.params.time == "day")
    {
        request('https://min-api.cryptocompare.com/data/histominute?fsym='+ coinName +'&tsym=USD&limit=144&aggregate=10',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //144 value for 1 day *10  = 1440 minute
    }
    else if(req.params.time == "week")
    {
        request('https://min-api.cryptocompare.com/data/histohour?fsym='+ coinName +'&tsym=USD&limit=168&aggregate=1',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //168 value for 1 week *1  = 168 hours    
}
    else if(req.params.time == "month")
    {
        request('https://min-api.cryptocompare.com/data/histohour?fsym='+ coinName +'&tsym=USD&limit=120&aggregate=6',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //120 value for 1 month *6  = 720 hours    
}
    else if(req.params.time == "year")
    {
        request('https://min-api.cryptocompare.com/data/histoday?fsym='+ coinName +'&tsym=USD&limit=182&aggregate=2',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //  182 value for 1 year *2  = 365 days    
}
    else if(req.params.time == "all")
    {
        request('https://min-api.cryptocompare.com/data/histoday?fsym='+ coinName +'&tsym=USD&aggregate=10',{json: true}, (err, response, body) => {
            res.json(body.Data);
        })
        //72 value for 1 day * 10  = 2000 VALUE    
}
    else 
        res.status(404).json("not found")
})



router.get('/data/:coin/price', function(req, res) {
    request('https://min-api.cryptocompare.com/data/histominute?fsym='+ req.params.coin.toString().toUpperCase() +'&tsym=USD&limit=1',{json: true}, (err, response, body) => {
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
                            attributes: ['image','price','volume','marketcap','name','fullname'],
                            through: {attributes: []}    
                        }],
                order: sequelize.literal('marketcap DESC'),
            }).then((coins) => {
                res.status(200).json(coins);
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
            models.favorites.build({
                coin_id: req.params.coin,
                user_id: authData.user.id  
            })
            .save()
            .then(() => { res.json({created: true}) })
            .catch((err) => { res.status(500).json("Internal server error") })
        }
    })
})


router.delete('/fav/:coin', AuthMiddleware, function(req, res) {
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
//            res.json("hello :D");
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


module.exports = router;
