"use strict";

let express = require('express');
let app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(8080, function() {
    console.log("C'est parti ! En attente de connexion sur le port 8080...");
});

app.use(express.static('public'));

app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/theGame.html');
});

/**********************************************************************
 ***                      Gestion des websockets                    ***
 **********************************************************************/

// connection received
io.on('connection', function (socket) {

    // debug message
    console.log("player connected");

    /**
     *  log out handler
     */
    socket.on("disconnect", function() {
        console.log("player logged out");
    });
});
