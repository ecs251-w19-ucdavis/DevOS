//WebDAV server variables here
const path = require("path");

const createServerBase = require("./serverDAV4.js");
const createServer = createServerBase.webdavServer;

// AUTHORIZATION - BASIC
const server = createServer("basic");
flag = 0
server.start();
//WebDAV server variables above

const debug = require('diagnostics')('raft')
  , argv = require('argh').argv
  , LifeRaft = require('liferaft');

let msg;

if (argv.queue) msg = require(argv.queue);
else msg = require('axon');

//
// We're going to create own custom Raft instance which is powered by axon for
// communication purposes. But you can also use things like HTTP, OMQ etc.
//
class MsgRaft extends LifeRaft {

  /**
   * Initialized, start connecting all the things.
   *
   * @param {Object} options Options.
   * @api private
   */
  initialize (options) {
    debug('initializing reply socket on port %s', this.address);
    console.log('Inside initialize');
    const socket = this.socket = msg.socket('rep');
    console.log('We just initialized : ',this.address);
    socket.bind(this.address);
    socket.on('message', (data, fn) => {
      this.emit('data', data, fn);
    });

    socket.on('error', () => {
      debug('failed to initialize on port: ', this.address);
    });
  }

  /**
   * The message to write.
   *
   * @param {Object} packet The packet to write to the connection.
   * @param {Function} fn Completion callback.
   * @api private
   */
  write (packet, fn) {
    //console.log('Inside Write');
    if (!this.socket) {
      this.socket = msg.socket('req');
      console.log('Inside Write and connecting to ', this.address);
      this.socket.connect(this.address);
      this.socket.on('error', function err() {
        console.error('failed to write to: ', this.address);
      });
    }

    debug('writing packet to socket on port %s', this.address);
    this.socket.send(packet, (data) => {
      fn(undefined, data);
    });
  }
}

//
// We're going to start with a static list of servers. A minimum cluster size is
// 4 as that only requires majority of 3 servers to have a new leader to be
// assigned. This allows the failure of one single server.
//
const ports = [
  8081, 8082,
  8083, 8084,
  8085, 8086
];

//
// The port number of this Node process.
//
//var port0 = +argv.port || ports[0];
//var port1 = +argv.port || ports[1];
//var port2 = +argv.port || ports[2];
//var port3 = +argv.port || ports[3];
var port4 = +argv.port || ports[4];

//
// Now that we have all our variables we can safely start up our server with our
// assigned port number.
//
const raft = new MsgRaft('tcp://127.0.0.5:'+ port4, {
  'election min': 2000,
  'election max': 5000,
  'heartbeat': 10
});

raft.on('heartbeat timeout', function () {
  debug('heart beat timeout, starting election');
  console.log('Heart beat timed out, starting election');

  //Change for WebDAV here
  server.stop()
  console.log('WebDAV server stopped')
  //Change ended here
});

raft.on('term change', function (to, from) {
  debug('were now running on term %s -- was %s', to, from);
  console.log('were now running on term %s -- was %s', to, from);
  
}).on('leader change', function (to, from) {
  debug('we have a new leader to: %s -- was %s', to, from);
  console.log('we have a new leader to: %s -- was %s', to, from);
  console.log('***************************')
  if(LifeRaft.states[raft.state] == 'CANDIDATE'){
    console.log('LEADER')
  }
  else{
    console.log(LifeRaft.states[raft.state])
  }

  //Changes here for WebDAV Server
  if(LifeRaft.states[raft.state] == 'CANDIDATE'){
    //console.log('LEADER INSIDE IF')

  
    server.start();
  console.log('WebDAV server started')  
  // KEEP TRACK OF START AND END CALLS
  //server.start()
  process.on("SIGTERM", function() {
      console.log('Inside Raft4')
      server.stop();
      process.exit(0);
  });
  process.on("SIGINT", function() {
      console.log('Inside Raft 4')
      server.stop();
      process.exit(0);
  });
  }
//changes till here */


}).on('state change', function (to, from) {
  //if (to == '2'){
   // console.log('Stopping Webdav server since this is not master')
   // server.stop();
  //}
  debug('we have a state to: %s -- was %s', to, from);
  console.log('we have a state to: %s -- was %s', to, from);
  //console.log('***************************')
  //console.log(LifeRaft.states[raft.state])
  
  //if (to == '3'){
   // console.log('Starting Webdav server since this is master')
   // server.stop();
  //}
});

raft.on('leader', function () {
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('I am elected as leader', this.address);
  console.log(LifeRaft.states[raft.state]);
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

});

raft.on('candidate', function () {
  console.log('----------------------------------');
  console.log('I am starting as candidate', this.address);
  console.log(LifeRaft.states[raft.state]);
  console.log('----------------------------------');
});

//
// Join in other nodes so they start searching for each other.
//
ports.forEach((nr) => {
  if (!nr || port4 === nr) return;

  console.log('exec join');
  //raft.join('tcp://127.0.0.1:'+ nr);
  raft.join('tcp://127.0.0.2:'+ nr);
  raft.join('tcp://127.0.0.3:'+ nr);
  raft.join('tcp://127.0.0.4:'+ nr);
  raft.join('tcp://127.0.0.5:'+ nr);
});