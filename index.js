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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
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

app.post('/register', function(req, res) {
    // TODO: authentification
    if(req.body.password != req.body.passwordver) {
        res.status(200).json({error: "Passwords don't match",
                                message: 0
                            })
    }
    else {
        if(req.body.login && req.body.email && req.body.password)
        {
            models.user.findOne({
                where: {
                    [op.or]: {
                        login: req.body.login,
                        email: req.body.email,
                    }
                }
            })
            .then((FoundUser)=> { 
                if(FoundUser && FoundUser.dataValues.login == req.body.login){
                    console.log("im 1 ");
                    res.status(200).json({error: "Login already in use",
                        message: 0
                    })
                }
                else if (FoundUser && FoundUser.dataValues.email == req.body.email) {
                    console.log("im 2");
                    res.status(200).json({error: "Email already in use",
                        message: 0
                    })
                }
                else {
                    console.log("and 3");
                    models.user.create({
                        login: req.body.login,
                        email: req.body.email,
                        password: req.body.password
                    }).then(() => res.status(201).json({error: "",
                                                        message: 1
                                                        }))
                    .catch((err) => res.status(500).json({error: "An error has occured",
                                                            message: 0
                                                        }))
                }
            })
            .catch((err) => {
                console.log("4");
                res.status(500).json({error: "An internal error has occured",
                                                    message: 0
                                                })
            })
        }
        else {
        res.json({error: "Fill in the empty fields",
                    message: 0
                })
    }
    }
})

app.use('/api', routes);
app.use('/bot', bot);


app.listen(4000, function () {
    console.log('example app listening on 4000')
})
