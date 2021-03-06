const path = require("path");

const createServerBase = require("./serverDAV1.js");
const createServer = createServerBase.webdavServer;

// AUTHORIZATION - BASIC
const server = createServer("basic");
server.start();

// KEEP TRACK OF START AND END CALLS

process.on("SIGTERM", function() {
    console.log('Inside Raft')
    server.stop();
    process.exit(0);
});
process.on("SIGINT", function() {
    server.stop();
    process.exit(0);
});








