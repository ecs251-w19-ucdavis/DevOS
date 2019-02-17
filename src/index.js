var server = require('http');
var fs = require('fs');
var express	=	require("express");
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


//Part of the Node JS to navigate through pages

//Setting the port number to listen to the request
app.set('port', process.env.PORT || 3000);


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

//Change the IP Address here according 
app.listen(app.get('port'),'10.0.0.170', function(){
  console.log('Express started on http://localhost:' +
  app.get('port') + ' ; press Ctrl-C to terminate.' );
});