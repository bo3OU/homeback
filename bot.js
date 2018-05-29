var express = require('express');
var bot = express.Router();
const models = require('./models');
const request = require('request');
const sequelize = require('sequelize');
const op = sequelize.Op;

bot.post('/coin', (req, res) => {
    request('https://min-api.cryptocompare.com/data/all/coinlist',{json: true}, (err, response, body) => {

        Object.keys(body.Data).forEach((key) => {
            var element = body.Data[key];
            models.coin.create({
               name: element.Name,
               fullname: element.FullName,
               cc_id: parseInt(element.Id),
               algorithm: element.Algorithm,
               prooftype: element.ProofType,
               image: element.ImageUrl,
                
           })
        })
        .then(()=>{
            res.status(200).json("Done :D");
        })
        .catch((err) => {
            res.sendStatus(500);
         })
    })
})

bot.patch('/updateall', (req, res) => {
  //  
        // get list of coins in the database : cc_id and name of coin
        request('https://min-api.cryptocompare.com/data/all/coinlist',{json: true}, (err, response, body) => {
            var i,j,temparray,chunk = 300;
            for (i=0,j=array.length; i<j; i+=chunk) {
                temparray = array.slice(i,i+chunk);
                // do whatever
            }
            Object.keys(body.Data).forEach(x => {
                console.log(body.Data[x].Name);
                request('https://min-api.cryptocompare.com/data/histoday?fsym='+ x +'&tsym=USD&limit=1',{json: true}, (err, response, body) => {
                    console.log("Close : \n https://min-api.cryptocompare.com/data/histoday?fsym="+ x +"&tsym=USD&limit=1 \n =========> " + body);
                    // requested data for that specific Coin
                    // an api call for each coin 
                    // TODO : test if I can get data for all coins in ONE CALL // FOR FASTER UPDATE! 
                        // models.coin.update({ 
                        //     price: body.Data[0].price,
                        //     volume: element.volmume,
                        //     open: element.open,
                        //     close: element.close,
                        //     high: element.high,
                        //     low: element.low,
                        //     marketcap: element.marketcap,
                        //     }, 
                        //     { where: { cc_id: element.id  }}
                        // )
                        // .then(()=> {
                        // res.status(200).json("Data was updated for : " + element.name);
                        // })
                        // .catch((err)=>{
                        // res.sendStatus(500);
                        // })
                })
            })
        })



        // models.coin.findAll({
        //     attributes: ['name', 'cc_id']
        // })
        // .then((data)=> {
        //     console.log(data[700].name);
          
        //     data.forEach((element)=> {
        //         console.log("\n Getting Data For this coin : " + element.name);

        //         request('https://min-api.cryptocompare.com/data/histoday?fsym='+ element.name +'&tsym=USD&limit=1',{json: true}, (err, response, body) => {
        //             console.log("Close : \n https://min-api.cryptocompare.com/data/histoday?fsym="+ element.name +"&tsym=USD&limit=1 \n =========> " + response);
        //             // requested data for that specific Coin
        //             // an api call for each coin 
        //             // TODO : test if I can get data for all coins in ONE CALL // FOR FASTER UPDATE! 
        //                 // models.coin.update({ 
        //                 //     price: body.Data[0].price,
        //                 //     volume: element.volmume,
        //                 //     open: element.open,
        //                 //     close: element.close,
        //                 //     high: element.high,
        //                 //     low: element.low,
        //                 //     marketcap: element.marketcap,
        //                 //     }, 
        //                 //     { where: { cc_id: element.id  }}
        //                 // )
        //                 // .then(()=> {
        //                 // res.status(200).json("Data was updated for : " + element.name);
        //                 // })
        //                 // .catch((err)=>{
        //                 // res.sendStatus(500);
        //                 // })
        //         }).catch(()=> {
        //             res.sendStatus(500);
        //         });
        //     })
            
        //     res.status(200).json(data);
        // })
        // .catch(() => {
        //     res.sendStatus(500);
        // })
})

module.exports = bot;

