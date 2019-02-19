var http = require('http');
var fs = require('fs');
var express = require('express');
var socket = require('socket.io');

var multer	=	require('multer');
var app	=	express();

//For file upload - if you run from the DevOS folder like "node src/index.js" make no changes
//For file upload - if you run from the src folder change destination-callback to "./uploads" from "./src/uploads"
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './src/uploads');  
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});


//Printing all commandline arguments
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  });

//Setting Port from command line
app.set('port', process.env.PORT || process.argv[2]);

var server = app.listen(app.get('port'),'10.0.0.192', function(){
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


//For getting to the home page
app.get('/home',function(req,res){
  res.type('text/plain');
  res.send('Hello World');
});

//Post request of the file upload
app.post('/api',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		res.end("File is uploaded");
	});
});

//Custom 404 Page - Error Page

app.use(function(req,res,next){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Page not found');
});

//Custom 500 Page - Error page

app.use(function(req,res,next){
  res.type('text/plain');
  res.status(500);
  res.send('500 - Internal Server Error');
})


