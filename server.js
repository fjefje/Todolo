const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require("./js/db.js"); // Module for chatting with the DB.
const routerUser = require("./js/user.js"); // Module for users.
const routerList = require("./js/list.js"); // Module for users.
const que = require("./js/requestQue.js") // Module for the que of questions / requests for help.

app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(routerUser);
app.use(routerList);
app.use(que);


app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Oops thats bad');
});

app.listen(app.get('port'), function() {
    console.log('Tadaaa server', app.get('port'));
});

global.SUPER_SECRET_KEY = process.env.TOKEN_KEY || "TransparantWindowsFlyingDonkeys";