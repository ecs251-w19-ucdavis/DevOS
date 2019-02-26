var http = require('http');

var express = require('express');
var socket = require('socket.io');
var path = require('path');

var app	=	express();
app.set('port', process.env.PORT || process.argv[2]);


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

io.on('connection',function(socket){
    console.log('A User made a socket connection to webdav',socket.id);
});


