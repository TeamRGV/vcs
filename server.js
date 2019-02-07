const port = 8080;

const path = require('path');
const express = require('express');
const controller = require('./controller.js');

//for using http server instead of express server
var app = express();
app.use(controller);
app.use('', controller);

var server = require('http').createServer(app);

app.set('view engine', 'ejs');

server.listen(port, () =>{
    console.log("Server started on port" + port);
});
