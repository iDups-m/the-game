"use strict";

let express = require('express');
let app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(8080, function() {
    console.log("connected");
});

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/theGame.html');
});

/***************************************************************
                handle client and the game
 ***************************************************************/

// Players connected
let players = {};


/**********************************************************************
 ***                              websocket                         ***
 **********************************************************************/

// connection received
io.on('connection', function(socket) {

    // debug message
    console.log("player connected");

    let index = -1; // -1 : waiting for connection, 0 : connected, 1 : ready to play

    /**
     *  Ask for a connection of the player.
     *  @param  name    the name of the player
     */
    socket.on("log_in", function(name) {

        console.log(players[name]);

        // if player is already playing
        if(index !== -1) {
            socket.emit("erreur", "Joueur already connected.");
            return;
        }

        // verify that the name is not already used
        if( (players[name] === 0 ) || (players[name] === 1 )){
            console.log("BUG");
            socket.emit("error", "A player with this name is already connected.");
            return;
        }

        socket.emit("error", "Just a try");

        index = 0;
        players[name] = index;

        // message de debug
        console.log("Name received : ", name);

        socket.emit("players", players);

    });

    /**
     *  log out handler
     */
    socket.on("disconnect", function() {
        console.log("player logged out");
    });

});
