const express = require('express')
const models = require('./models');
var app = express()
var routes = require('./routes');
var bot = require('./bot');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const sequelize = require('sequelize');
const op = sequelize.Op;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.post('/register', function(req, res) {
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


app.post('/logout', (req, res) => {

})

app.use('/api', routes);
app.use('/bot', bot);


app.listen(3000, function () {
    console.log('example app listening on 3000')
})
