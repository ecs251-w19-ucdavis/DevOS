const { createClient } = require("webdav");

//http agent
const http = require('http');
// const keepAliveAgent = new http.Agent({path : '127.0.0.1', keepAlive: true, timeout : 5000, defaultPort : 4392 });
// const myHttpAgent = new http.Agent({keepAlive : true});


//myHttpAgent.getName({host : '127.0.0.1', port: 4392});


const fs = require('fs');
const client = createClient(
    "http://127.0.0.1:4000/",
    {
        username : 'sanjat',
        password : 'sanjat'
    }

);

var choice = process.argv[2];
// http.createServer(function(req,res){
//     fs.readFile('browserClient.html',function (err, data){
//         res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
//         res.write(data);
//         res.end();
//     });
// }).listen(3000);

switch(choice)
{
    case 'getDirectory' : client.getDirectoryContents("/", {deep : true}).then(function(contents) {
                                console.log('Listing Directories ..');
                                console.log(JSON.stringify(contents, undefined, 4));
                            }).catch(function(err) {
                                console.error(err);
                            });
                            break;

     case 'createDirectory' : 
                                pathToNewDirectory = process.argv[3];
                                client.createDirectory(pathToNewDirectory).then(function(contents){
                                    console.log('Making Directories ..');
                                    console.log((contents));
                                }).catch(function(err) {
                                    console.error(err);
                                });
                            break;

     case 'getFileContents' :   
                            filepath = process.argv[3];    
                            console.log('Fetching File Data from  ',filepath);
                            client.getFileContents(filepath, { format: "text" }).then(function(contents){
                                    console.log('PRINTING CONTENTS OF THE FILE ..');
                                    console.log((contents));
                                }).catch(function(err) {
                                    console.error(err);
                                });
                            break;
    case 'download' :
                            downloadLink = process.argv[3];    
                            console.log('Download link for file at location:  ',downloadLink);
                            link = client.getFileDownloadLink(downloadLink)
                            console.log('Download at ..  ',link);
                            break;

    case 'putFile' :
                            filepath = process.argv[3]; 
                            writeInput = process.argv[4];    
                            console.log('Writing this to file ..  ',writeInput);
                            client.putFileContents(filepath,writeInput, {overwrite : false}).then(function(contents){
                                console.log('Write Complete');
                            });
                            break;
}



