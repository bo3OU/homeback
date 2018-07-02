const express = require('express')
const models = require('./models');
var app = express()
var routes = require('./routes');
var bot = require('./bot');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const sequelize = require('sequelize');
const bc = require('bcrypt');
const op = sequelize.Op;

// use JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS
app.use(cors({
origin: '*',
optionsSuccessStatus: 200 // legacy browser (IE11) chokes on 204 
}))

app.post('/login', (req, res) => {
    if(req.body.login && req.body.password)
    {
        models.user.findOne({
            where:{
                [op.and]: {
                    login: req.body.login,
                    //password: req.body.password
                }
            }
        })
        .then((user) => {
            if(user) {
                // check password 
                bc.compare(req.body.password, user.password, function(err, response) {
                    console.log(user.password + " " + user.password);
                    if (response) {
                        jwt.sign({user: user}, 'secretkey', (err, token) => {
                            res.json({"token": token,"error":""});
                        })
                    } else {
                        res.json({"error":"Wrong combination"});
                    }
                });
            } else {
                res.json({"error":"Wrong combination"});
            }

        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({"error":"Internal server error"});
        })
    }
else {
    res.json({"error":"Fill in the fields"});
}
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
                    res.status(200).json({error: "Login already in use",
                        message: 0
                    })
                }
                else if (FoundUser && FoundUser.dataValues.email == req.body.email) {
                    res.status(200).json({error: "Email already in use",
                        message: 0
                    })
                }
                else {
                    // TODO encrypt 
                    const saltRounds = 10;

                    bc.hash(req.body.password, saltRounds, function(err, hash) {
                        // Store hash in your password DB.
                        models.user.create({
                            login: req.body.login,
                            email: req.body.email,
                            password: hash
                        }).then(() => res.status(201).json({error: "",
                                                            message: 1
                                                            }))
                        .catch((err) => res.status(500).json({error: "An error has occured",
                                                                message: 0
                                                            }))
                      });

                }
            })
            .catch((err) => {
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
