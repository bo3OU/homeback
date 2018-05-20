const express = require('express')
const models = require('./models');
var app = express()
var routes = require('./routes');


app.get('/', (req, res) => {

    models.coin.findAll().then(function(coin){
        console.log(coin)
    })
    res.send("salam");

});


app.get('/user', (req, res) => {

    models.user.findAll().then(function(coin){
        console.log(coin)
    })
    res.send("haha");

});

app.use('/api', routes);



app.listen(3000, function () {
    console.log('example app listening on 3000')
})
