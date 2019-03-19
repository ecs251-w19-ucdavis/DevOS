const path = require("path");
const ws = require("webdav-server").v2;

function createServer(dir, authType) {
    if (!dir) {
        throw new Error("Expected target directory");
    }

    // USER MANAGER CONTAINS ALL USER INFO
    const userManager = new ws.SimpleUserManager();
    const user = userManager.addUser("webdav-user", "pa$$w0rd!");
    const new_user = userManager.addUser('sanjat','sanjat', true);
    new_user.isAdministrator = true;
    new_user.isDefaultUser = true;

    // CHECK AUTHORIZATION (DEFAULT - BASIC)
    const auth =
        !authType || authType === "basic"
            ? new ws.HTTPBasicAuthentication(userManager)
            : new ws.HTTPDigestAuthentication(userManager, "test");

    // PRIVELEGE MANAGER KEEPS TRACK OF RIGHTS
    // SERVER DEFAULT - 127.0.0.1:4000

    const privilegeManager = new ws.SimplePathPrivilegeManager();
    privilegeManager.setRights(user, "/", ["all"]);
    privilegeManager.setRights(new_user, "/", ["all"]);

    //SERVER CONFIG

    const server = new ws.WebDAVServer({
        port: 4003,
        httpAuthentication: auth,
        privilegeManager: privilegeManager,
        maxRequestDepth: Infinity
    });

    // LOAD VIRTUAL FILE SYSTEM WITH THE FOLLOWING FOLDER STRUCTURE

    server.autoLoad((e) => {
        if(e)
        { 
            server.rootFileSystem().addSubTree(server.createExternalContext(), {
                'folder1': {                                // /folder1
                    'file1.txt': 'Hi, This is FILE1',  // /folder1/file1.txt
                    'file2.txt': 'Hi, This is FILE2'   // /folder1/file2.txt
                },
                'file0.txt': 'Inside FILE0 '      // /file0.txt
            }); 
            server.setFileSystem('/myfiles',new ws.VirtualFileSystem, true, (success) => console.log(success));
            
            console.log('Finished setting up Virtual file system ..');
            
        }
    });
    console.log(`Created server on localhost with port: 4000, and authType: ${authType}`);
    return {
        start: function start() {
            return new Promise(function(resolve) {
                
                console.log("Starting WebDAV server at directory:", dir);
                console.log("User and passwords ..   ", userManager);
               
                server.setFileSystem("/webdavPhysical", new ws.PhysicalFileSystem(dir), function() {
                    console.log('Directory listing .. ');
                    console.log(server.fileSystems);
                    server.start(resolve);
                });
            });
        },

        stop: function stop() {
            return new Promise(function(resolve) {
                console.log("Stopping WebDAV server");
                server.stop(resolve);
            });
        }
    };
}

// MAPPING PHYSICAL FOLDER TO SERVER

createServer.webdavServer = function(authType) {
    return createServer(path.resolve(__dirname, "./folder1"), authType);
};


// CALL CREATESERVER from HELPER
// USERNAME : sanjat
// PASSWORD : sanjat
module.exports = createServer;