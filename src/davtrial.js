var http = require('http');

var express = require('express');
var socket = require('socket.io');
var path = require('path');

var app	=	express();
app.set('port', process.env.PORT || process.argv[2]);

//const fetch = require("node-fetch");
const webdavClient = require('webdav-client');
//const request = require('request')

/*
fetch(request, {mode: 'no-cors'})
.then(function(response) {
  console.log(response); 
}).catch(function(error) {  
  console.log('Request failed', error)  
});
*/



var server = app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' +
    app.get('port') + ' ; press Ctrl-C to terminate.' );
});

var io = socket.listen(server);



//Render Static Files

app.use(express.static('public'));
app.use(express.static('views'));




app.get('/',function(req,res){
    res.sendFile(__dirname + '/views/davcheck.html');
    console.log('Just rendered!');
});

app.get('/files',function(req,res){
    res.sendFile(__dirname +'/views/davfinale.html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    //res.send('cors problem fixed:)');
    console.log('Rendering WEBDAV');
});

io.on('connection',function(socket){
    console.log('A User made a socket connection to webdav',socket.id);
});


