var server = require('http');
var fs = require('fs');
var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);


//Custom 404 Page

app.use(function(req,res){
    res.type('text/plain');
    res.send('Sanjats Page');
});

app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Page not found');
});



app.listen(app.get('port'),'10.0.0.188', function(){
    console.log('Express started on http://localhost:' +
    app.get('port') + ' ; press Ctrl-C to terminate.' );
});