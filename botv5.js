const   models = require('./models');
const   sr = require('sync-request');
var limit = require("simple-rate-limiter");
var request = limit(require("request")).to(2).per(1000);
var mysql = require('mysql2');
const sequelize = require('sequelize');
var fs = require('fs');

const op = sequelize.Op;
var con = mysql.createConnection({
    "user": "ali",
    "password": "alibagho2153",
    "database": "final",
    "host": "127.0.0.1",
    connectionLimit: 15,
    queueLimit: 30,
    acquireTimeout: 1000000
  });

  models.coin.findAll({
      attributes: ["name"],
      where:{ close: {[op.eq]: null} },
      order: [
        ['name', 'DESC']],
      raw: true, // OFFSET 2056 LIMIT 1000 AND STORE ALL COIN THAT HAS NO MKTCAP VALUE AND VOLUME VALUE TODO
  }).then(function(names) {
        names.forEach(element => {
          var url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + element.name + '&tsym=USD&limit=1';
          console.log(url);
          request(url, function(error, response, body) {
            body = JSON.parse(body);
              if(body.Response == "Success" && body.Data[0] && body.Data[0].close ){
                 var sql = "UPDATE coin SET open = "+ body.Data[0].open +
                 ", close ="+ body.Data[0].close +
                 ", high ="+ body.Data[0].high +
                 ", open ="+ body.Data[0].open +
                 " WHERE name = '" + element.name + "'"; 
                con.query(sql, (function (err, result) {
                  console.log(sql);
              })());
              }
          })
        });
  })