var express = require('express')
var router = express.Router();
var db = require("./db.js");
var jwt = require('jsonwebtoken');
var SUPER_SECRET_KEY = process.env.TOKEN_KEY || "TransparantWindowsFlyingDonkeys"; // for use with web token.

//---------------------- endpoint - list all users ----------------------------

router.get('/app/user', async function(req,res,next){


    //let token = req.headers['x-access-auth'] || req.body.auth || req.params.auth; // Suporting 3 ways of submiting token
    
    let token = req.query["auth"];
    console.log("her er tokenet", token);
    
    try {
       let validToken = jwt.verify(token, SUPER_SECRET_KEY); // Is the token valid? 
       console.log("ok token", validToken);
    } catch(err) {
        console.log(err);
        res.status(401).json({msg: "Ugyldig token"}).end();
        return;
    }   
    
        
    try {        

        let query = "Select * from Users";

        let result = await db.select(query);
        let jsonResult = JSON.stringify(result);

         console.log("db res", jsonResult);

        //let users = db.select(query);
        if(result){
            res.status(200).json(jsonResult);
        }else{
            res.status(500).send("No records in DB").end();
        }

    } catch (err) {

        console.log("DB error");
        res.status(500).send("DB error").end(); // The token could not be validated so we tell the user to log in again.
    }


});

//------------------------ endpoint - create new user -------------------------------

router.post('/app/user', async function(req,res,next){

    let userEmail = req.body.email;
    let userName = req.body.name;
    let paswordHash = req.body.pswHash;
    let userRole = req.body.userRole;

    let query = `INSERT INTO "public"."users"("email", "username", "hash", "role") 
        VALUES('${userEmail}', '${userName}', '${paswordHash}', ${userRole}) RETURNING "id", "email", "username", "hash", "role"`;

    console.log(query);
    let result = await db.insert(query);

    console.log(result[0].id);

    if (result) {
        let token = jwt.sign({
            id: result[0].id,
            username: result[0].username
        }, SUPER_SECRET_KEY); // Create token

        res.status(200).json({tok: token}).end()
    }

    else {
        res.status(500).json({}).end()
    }




})

//---------------------- endpoint - login ---------------------------

router.post('/app/user/auth', async function(req,res,next){

    console.log("hallo fra login");
    console.log(req.body);

    let passwordHash = req.body.pswHash;
    let username = req.body.user;

    console.log(passwordHash, username);

    let sql = `SELECT * FROM users WHERE username='${username}' AND hash = '${passwordHash}'`;
    let result = await db.select(sql)

    console.log("resultat fra db", result);
    
    if(result){

        let tok = jwt.sign({
            id: result.id,
            username: result.name
        }, SUPER_SECRET_KEY); // Create token
        
        res.status(200).json({token: tok}).end();
    
    } else{
        res.status(401).json({}).end();
    }

    /*let query = `Select * from Users where userName='${username}'
    and hash='${passwordHash}'`;

    let user = db.select(query) ;

    console.log(user);

    if(user){

        /*let token = jwt.sign({
            id: user.id,
            username: user.name
        }, SUPER_SECRET_KEY); // Create token */

    /*

        res.status(200).json(user).end()
    } else{
        res.status(401).json({}).end();
    }*/
})

//--------------------- endpoint - lister ------------------------------
router.post('/app/liste', async function(req,res,next){
    
    let userid = req.body.userid;
    let listenavn = req.body.listenavn;
    let listeid = req.body.listeid;

    let query = `INSERT INTO "public"."alle_lister"("userid", "listenavn","listeid") 
        VALUES('${userid}', '${listenavn}', '${listeid}') RETURNING *`;

    console.log(query);
    let result = await db.insert(query);

    console.log(result[0].id);

    if (result) {
        let token = jwt.sign({
            id: result[0].id,
            username: result[0].username
        }, SUPER_SECRET_KEY); // Create token

        res.status(200).json({tok: token}).end()
    }

    else {
        res.status(500).json({}).end()
    }
})




module.exports = router;