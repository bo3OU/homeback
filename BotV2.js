const   models = require('./models');
const   sr = require('sync-request');
var mysql = require('mysql2');
const sequelize = require('sequelize');
const op = sequelize.Op;
var con = mysql.createConnection({
    "user": "ali",
    "password": "alibagho2153",
    "database": "final",
    "host": "localhost",
    connectionLimit: 15,
    queueLimit: 30,
    acquireTimeout: 1000000
  });

models.coin.findAll({
    attributes: ["name"],
    raw: true,
}).then(function(data){
    var j,chunk = 50;
    for (let i=0,j=data.length; i<j; i+=chunk) {
        var urlVar = '';
        data.slice(i,i+chunk).forEach(function(coin){
            urlVar = urlVar+ coin.name + ',';
        })
        let ress = sr('GET', 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + urlVar.substring(0, urlVar.length - 1) + '&tsyms=USD');
        var PriceList = JSON.parse(ress.getBody('utf8'));
            for(let iter = 0; iter < Object.keys(PriceList).length; iter++) {
                (function(){
                    console.log(PriceList[Object.keys(PriceList)[iter]].USD)
                    var sql = "UPDATE coin SET price = "+ PriceList[Object.keys(PriceList)[iter]].USD +" WHERE name like '" + Object.keys(PriceList)[iter]+ "'"; 
                    con.query(sql, (function (err, result) {
                        console.log(sql);
                    })());
                })()            
            } 
    }
})
function update(sql) {

}
// const fs = require('fs');
// var file = fs.readFileSync('my_file.txt','utf8');
// var array = file.split('\n');
// // if(array.indexOf("BTC") > -1)
// //   console.log('true')
// let back = sr('GET', 'https://www.cryptocompare.com/api/data/coinlist/');
// back = JSON.parse(back.getBody('utf8'));
// let i=0,j = 0;
// Object.keys(back.Data).forEach(element => {
//     if(array.indexOf(element) > -1){
//         models.coin.create({
//             name: back.Data[element].Name,
//             fullname: back.Data[element].FullName,
//             cc_id: parseInt(back.Data[element].Id),
//             algorithm: back.Data[element].Algorithm,
//             prooftype: back.Data[element].ProofType,
//             image: back.Data[element].ImageUrl,
             
//         })
//     }
// });


