var express = require('express');
var router = express.Router();
const models = require('./models');
const request = require('request');
const sequelize = require('sequelize');
const op = sequelize.Op;

// GET      /hist/:coin/:time/
// GET      /coin/:coin/news
// GET      /data/:coin/price
// GET      /search/:string
// GET      /coin/data
// GET      /favs/:user
// DELETE   /fav/:coin/user/:user
// PUT      /fav/:coin/user/:user


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

router.put('/fav/:coin/user/:user', function(req, res) {
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
    .catch(err=> res.status(500).json("Internal server error : " + err))
    // models.sequelize.query("select 1 from favorites where user_id = " + req.params.user + " and coin_id = "+ req.params.coin, {logging: console.log, raw: true, type: 'SELECT'})
    // .then(res => {
    //     result = res;
    // })
    // .catch(()=>{
    //     res.status(500).json("Internal server error");
    // });


    // models.user.findOne({
    //     where: {
    //         id: req.params.user
    //     },
    //     attributes:[],
    //     include: [{ model: models.coin,
    //                 attributes: ['image','price','volume','marketcap','name','fullname'],
    //                 through: {attributes: []}    
    //             }],
    //     order: sequelize.literal('marketcap DESC'),
    // }).then((coins) => {
    //     res.status(200).json(coins);
    // }).catch((error) => {
    //     res.status(500).send('Internal server error');
    // })
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
