var net = require('net'),
    JsonSocket = require('json-socket');

var port = process.argv[2];
var server = net.createServer();

server.listen(port,'10.0.0.188');

server.on("connection",function(socket){
    socket = new JsonSocket(socket);
    socket.on('message', function(message){
        console.log('Received message from client');
        var result = message.a + message.b;
        var portnum = process.argv[2];
        socket.sendMessage({sum : result, portSend : portnum });
    });
});

console.log('Server started at port : ', port, ' Press Ctrl - C to exit');