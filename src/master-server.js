var net = require('net'),
    JsonSocket = require('json-socket');

//var port = process.argv[2];

'use strict';
 
var LifeRaft = require('liferaft');
        var raft = new LifeRaft({
            'address': 'tcp://127.0.0.1:8080',
            'election min': '200 millisecond',
            'election max': '1 second'
        });

        var node = raft.join('127.0.0.1:8089', function write(packet) {
            // Write the message to the actual server that you just added.
            console.log('Are you joinin?!');
          });


var LifeBoat = raft.extend({
  server: null,
  socket: null,
  write: function write(packet, callback) {
    if (!this.socket) this.socket = require('net').connect(this.address);
    message = 'Writing'
    socket.sendMessage({chat : message });

    // More code here ;-)
  },
  initialize: function initialize(options, fn) {
    this.server = require('net').createServer(function () {
      // Do stuff here to handle incoming connections etc.
      //server.listen(port);
      server.on("connection",function(socket){
        socket = new JsonSocket(socket);
        socket.on('message', function(message){
            console.log('Received message from another raft node');
            var result = message.a + message.b;
            var portnum = process.argv[2];
            socket.sendMessage({sum : result, portSend : portnum });
        });
    });

    }.bind(this));



    var next = require('one-time')(fn);

    this.server.once('listening', next);
    this.server.once('error', next);

    this.server.listen(this.address);
  }
});
  /*     
var server = net.createServer();

server.listen(port);

server.on("connection",function(socket){
    socket = new JsonSocket(socket);
    socket.on('message', function(message){
        console.log('Received message from client');
        var result = message.a + message.b;
        var portnum = process.argv[2];
        socket.sendMessage({sum : result, portSend : portnum });
    });
});
*/
console.log('Server started at port : ', port, ' Press Ctrl - C to exit');