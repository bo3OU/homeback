const express = require('express')
const models = require('./models');
var app = express()
var routes = require('./routes');


app.get('/', (req, res) => {

    models.coin.findAll().then(function(coin){
        console.log(coin)
    })
    res.send("RIP ancalogon");

});


app.get('/user', (req, res) => {

    models.user.findAll().then(function(coin){
        console.log(coin)
    })
    res.send("aerendil is da best");

});



app.use('/api', routes);



app.listen(3000, function () {
    console.log('example app listening on 3000')
})
