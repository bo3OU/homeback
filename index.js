const express = require('express')
const models = require('./models');
var app = express()
var routes = require('./routes');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const sequelize = require('sequelize');
const op = sequelize.Op;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("RIP ancalogon");
});


app.get('/user', (req, res) => {
    models.user.findAll().then(function(coin){
        console.log(coin)
    })
    res.send("aerendil is da best");

});

app.post('/login', (req, res) => {
    models.user.findOne({
        where:{
            [op.and]: {
                login: req.body.login,
                password: req.body.password
            }
        }
    })
    .then((user) => {
        if(user) {
            jwt.sign({user: user}, 'secretkey', (err, token) => {
                res.json({token: token});
            })
        }
        else {
            res.json("wrong combination");
        }
    })
    .catch((err) => {
        res.status(500).json("Internal server error");
    })
})


app.use('/api', routes);



app.listen(3000, function () {
    console.log('example app listening on 3000')
})
