var http = require('http');
var fs = require('fs');
var express = require('express');
var socket = require('socket.io');

var app = express();


//Printing all commandline arguments
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  });

  app.set('port', process.env.PORT || process.argv[2]);

  var server = app.listen(app.get('port'),'10.0.0.188', function(){
    console.log('Express started on http://localhost:' +
    app.get('port') + ' ; press Ctrl-C to terminate.' );
});

var io = socket.listen(server);


//Socket setup


app.get('/',function(req,res){
    res.sendFile(__dirname + '/views/main.html')
    console.log('Just rendered!');
});


//Socket Connection


io.on('connection',function(socket){
    console.log('A User made a socket connection',socket.id);
})




//Custom 404 Page

app.use(function(req,res,next){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Page not found');
});

//Custom 500 Page

app.use(function(req,res,next){
    res.type('text/plain');
    res.status(500);
    res.send('500 - Internal Server Error');
})


