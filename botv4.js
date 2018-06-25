const   models = require('./models');
const   sr = require('sync-request');
var limit = require("simple-rate-limiter");
var request = limit(require("request")).to(20).per(1000);
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

// Get open close high low of a coin
// https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=10
// full data of a coin
// https://min-api.cryptocompare.com/data/top/exchanges/full?fsym=BTC&tsym=USD
var stream = fs.createWriteStream("myfile4lol.txt");
stream.once('open', function(fd) {


var jk = 0,jkk = 0;
  models.coin.findAll({
      attributes: ["name"],
      //where:{ marketcap: {[op.eq]: null} },
      order: [
        ['name', 'ASC']],
      raw: true, // OFFSET 2056 LIMIT 1000 AND STORE ALL COIN THAT HAS NO MKTCAP VALUE AND VOLUME VALUE TODO
  }).then(function(names) {
        names.forEach(element => {
          
          
          //var url = 'https://min-api.cryptocompare.com/data/top/exchanges/full?fsym=' + element.name + '&tsym=USD';
          var url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + element.name + '&tsyms=USD';
          console.log(url);
          request(url, function(error, response, body) {
            body = JSON.parse(body);
            jkk++;
            //console.log(element.name);
              if(body["RAW"] && body["RAW"][element.name] && body["RAW"][element.name]["USD"].MKTCAP && 
                                              body["RAW"][element.name]["USD"].TOTALVOLUME24HTO &&  
                                              body["RAW"][element.name]["USD"].MKTCAP != 0 && 
                                              body["RAW"][element.name]["USD"].TOTALVOLUME24HTO != 0) {
                //body.Response == "Success") {
                var sql = "UPDATE coin SET volume = "+ 
                body["RAW"][element.name]["USD"].TOTALVOLUME24HTO +
                ", marketcap ="+ body["RAW"][element.name]["USD"].MKTCAP +
                ", change24 = "+ body["RAW"][element.name]["USD"].CHANGEPCTDAY +
                " WHERE name = '" + element.name + "'"; 
                con.query(sql, (function (err, result) {
                  console.log(sql);
              })());
              }
              else {
              }
          })
        });
        // var data = sr('GET','https://api.coinmarketcap.com/v2/ticker/');
        // data = data.getBody('utf8');
        // console.log(data["data"]);
        // Object.keys(data.data).forEach(element => {
        //     console.log(data.data[element]);
        //     models.coin.findOne({
        //         where: {
        //             name: data[element].name
        //         }
        //     }).then(function(coin) {
        //         if(coin) {
        //             jk++;
        //             // coin.updateAttributes({

        //             // })
        //         }
        //     })
        // });
  })

  //stream.end();
});

function update(sql) {
  con.query(sql, (function (err, result) {
      console.log(sql);
  })());
}