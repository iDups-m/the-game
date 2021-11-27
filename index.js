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

// Every games and players in rooms
let games = {
    2 : {},
    3 : {},
    4 : {},
};
let nbRoom = {
    2 : 0,
    3 : 0,
    4 : 0,
};


/**********************************************************************
 ***                              websocket                         ***
 **********************************************************************/

// connection received
io.on('connection', function(socket) {

    // debug message
    console.log("player connected");

    let index = 0; // 0 : not connected, 1 : connected

    /**
     *  Ask for a connection of the player.
     *  @param name    the name of the player
     *  @param nbPlayers number of players in the room
     */
    socket.on("join_room", function(name, nbPlayers) {

        // if player is already playing
        if(index === 1) {
            socket.emit("error", "Joueur already connected.");
            return;
        }

        // verify that the name is not already used in the room
        /*if( (players[name] === 0 ) || (players[name] === 1 )){
            socket.emit("error", "A player with this name is already connected.");
            return;
        }

        index = 0;
        players[name] = index;*/

        // For the moment :
        //socket.emit("players", players);
        socket.emit("error", "Join bien reçu");
    });


    socket.on("create_room", function (name, nbPlayers){
        socket.emit("error", "Create bien reçu");

        let index = nbRoom[nbPlayers];
        games[nbPlayers][index] = {};
        games[nbPlayers][index]["name"] = name;
        games[nbPlayers][index]["socket"] = socket;
        nbRoom[nbPlayers]++;

        let players = [];
        players.push(games[nbPlayers][index]["name"]);
        socket.emit("players", players);
    });


    /**
     *  log out handler
     */
    socket.on("disconnect", function() {
        console.log("player logged out");
    });

});
