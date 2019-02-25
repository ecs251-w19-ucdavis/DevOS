var net = require('net'),
    JsonSocket = require('json-socket');

var port = process.argv[2]; //The same port that the server is listening on
var host = '127.0.0.1';

var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket

socket.connect(port, host);

socket.on('connect', function() { //Don't send until we're connected
    socket.sendMessage({a: 5, b: 7});
    console.log('Client Sending Message!');
    socket.on('message', function(message) {
        console.log('The result is: '+message.sum + 'sent by server on port: ' +message.portSend);
    });
});