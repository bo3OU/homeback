const   models = require('./models');
const   sr = require('sync-request');
var mysql = require('mysql');
const sequelize = require('sequelize');
const op = sequelize.Op;
var con = mysql.createConnection({
    "user": "ali",
    "password": "alibagho2153",
    "database": "final",
    "host": "127.0.0.1",
  });


var data = sr("GET","https://min-api.cryptocompare.com/data/v2/news/?lang=EN");
data = JSON.parse(data.getBody('utf8')).Data;
data.forEach(element => {
    // models.news.findOrCreate(
    // {
    //     where: {
    //         id: element.id
    //     },
    //     defaults: {
    //         url: element.url,
    //         title: element.title,
    //         overview: element.body,
    //         image: element.imageurl,
    // }})
    models.news.Create(
        {
                id: element.id,
                url: element.url,
                title: element.title,
                overview: element.body,
                image: element.imageurl,
        })
    .catch(function(err){
            console.log(err);
    })
});