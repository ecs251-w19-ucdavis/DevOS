var server = require('http');
var fs = require('fs');
var express = require('express');



// For File Upload

const fileUpload = require('express-fileupload');
var app = express();

app.set('port', process.env.PORT || 3000);

app.use(fileUpload());

app.post('/upload', function(req,res){
    if(Object.keys(req.files).length == 0){
        return res.status(400).send('No Files were uploaded');
    }

    let sampleFile = req.files.sampleFile;

    sampleFile.mv('', function(err) {
        if (err)
          return res.status(500).send(err);
    
        res.send('File uploaded!');


})


app.get('/home',function(req,res){
    res.type('text/plain');
    res.send('Sanjats Page');
});

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


app.listen(app.get('port'),'10.0.0.188', function(){
    console.log('Express started on http://localhost:' +
    app.get('port') + ' ; press Ctrl-C to terminate.' );
});