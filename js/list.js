var express = require('express');
var router = express.Router();
var db = require("./db.js");
var jwt = require('jsonwebtoken');
var auth = require('./auth.js');

//-------------------- Lager lister i DB -----------------------------
router.post('/app/list/create', async function(req,res,next){


    //let token = req.headers['x-access-auth'] || req.body.auth || req.params.auth; // Suporting 3 ways of submiting token
    
    let token = req.body.token;
    console.log("her er tokenet", token);
    if(token === undefined){
        res.status(401).json({msg: "ingen token sendt fra klienten"}).end();
        return;
    }
    let userID = req.body.userID;
    let listenavn = req.body.listenavn;
    let dt = new Date();
    let txtDate = dt.toISOString().slice(0,10);
    let sql = "INSERT INTO alle_lister(userid, listenavn, time) VALUES(" + 
        userID.toString() + ", '" + listenavn + "','" + txtDate + "')";
            console.log(sql);
    let result = await db.insert(sql);
    console.log(result);
    res.status(200).json(result).end();
});
//----------------------------------------------------------
router.get('/app/list/', auth, async function(req,res,next){
    //let query = "Select * FROM alle_lister";
    //let lists = db.select(query);
    
    
    /*
    let token = req.body.token;
    console.log("her er tokenet", token);
    if(token === undefined){
        res.status(401).json({msg: "ingen token sendt fra klienten"}).end();
        return;
    }
    */
    let userID = req.token.id;
    let sql = `SELECT * FROM "public"."alle_lister" WHERE "userid"=${userID}`;
    let result = await db.select(sql);
    
    console.log(sql);
    
    res.status(200).json(result).end();
});

router.post('/app/list/update', async function(req,res,next){
    /*
    let token = req.body.token;
    console.log("her er tokenet", token);
    if(token === undefined){
        res.status(401).json({msg: "ingen token sendt fra klienten"}).end();
        return;
    }
    */
// --------------Må lage variabler for alle verdiene i sql statementen. 
// --------------Må lage sql i index router.post('/app/list/update');
    let query = "Select * FROM alle_lister";
    let lists = db.select(query);
    
    //let userid = req.body.navn fra index
        
    let brukerid = req.body.userid;
    let listeid = req.body.listeid;
    let listenavn = req.body.listenavn;
    
    console.log(hello);
    
    let userID = req.query["userID"];
    let sql = `UPDATE alle_lister SET listenavn='${listenavn}',time='${time}' WHERE userid=${userid} AND listeid=${listeid}`;
    let result = await db.insert(sql);
    
    res.status(200).json(result).end();
});

module.exports = router;