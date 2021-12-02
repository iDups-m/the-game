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


/**
 *  Removed game
 *  @param nbPlayers the number of the players in the room
 *  @param game the game to remove
 */
function removeGame(nbPlayers, game) {
    console.log("Remove the game " + game + " of " + nbPlayers + " players");
    delete games[nbPlayers][game];
}


/**********************************************************************
 ***                              websocket                         ***
 **********************************************************************/

// connection received
io.on('connection', function(socket) {

    // debug message
    console.log("player connected");

    let index = 0;                  // 0 : not connected, 1 : connected
    let nbPlayersInGame = null;     // the number players planed playing with the player in the room
    let game = null;                // number of the game where the player is playing
    let num = null;                 // number of the player in the room

    /**
     *  Ask for a connection of the player.
     *  @param name the name of the player
     *  @param nbPlayers number of players in the room
     */
    socket.on("join_room", function(name, nbPlayers) {

        // if player is already playing
        if(index === 1) {
            socket.emit("error", "Joueur already connected.");
            return;
        }

        // searching for a room in need of other players
        let roomFree = -1;
        console.log("nbRoom[nbPlayers]="+games[nbPlayers][i].length);
        for (let i = 0; i < nbRoom[nbPlayers]; ++i) {
            console.log("games[nbPlayers][i].length ="+games[nbPlayers][i].length);
            //TODO: bug : .length is not defined !
            if(games[nbPlayers][i].length < nbPlayers){
                roomFree = i;
                break;
            }
        }
s
        console.log("roomFree ="+roomFree); //TODO: bug : -1 print (must be 0)

        /*if(roomFree === -1){
            // Creation of a new room
            game = nbRoom[nbPlayers];
            games[nbPlayers][game] = {};
            games[nbPlayers][game][0] = {};
            nbRoom[nbPlayers]++;

        } else {
            // verify that the name is not already used in the room
            for (let i=0; i<games[nbPlayers][roomFree].length; ++i){
                if(games[nbPlayers][roomFree][i]["name"] === name){
                    socket.emit("error", "A player with this name is already connected.");
                    return;
                }
            }
            game = roomFree;
        }

        index = 1;
        nbPlayersInGame = nbPlayers;
        let i = games[nbPlayers][game].length;
        games[nbPlayers][game][i] = {};
        games[nbPlayers][game][i]["name"] = name;
        //games[nbPlayers][game][i]["socket"] = socket;
        games[nbPlayers][game][i]["socket"] = "la socket sa mère";

        /*let players = [];
        for (let i=0; i<games[nbPlayers][game].length; ++i){
            players.push(games[nbPlayers][game][i]["name"]);
        }*/
        //socket.emit("players", players);
        socket.emit("debug", games);
    });


    socket.on("create_room", function (name, nbPlayers){
        // if player is already playing
        if(index === 1) {
            socket.emit("error", "Player already connected.");
            return;
        }

        index = 1;
        game = nbRoom[nbPlayers];
        nbPlayersInGame = nbPlayers;
        num = 0;

        games[nbPlayers][game] = {};
        games[nbPlayers][game][num] = {};
        games[nbPlayers][game][num]["name"] = name;
        //games[nbPlayers][game][num]["socket"] = socket;
        games[nbPlayers][game][num]["socket"] = "la socket sa mère";
        nbRoom[nbPlayers]++;

        let players = [];
        players.push(games[nbPlayers][game][num]["name"]);
        socket.emit("players", players);
        //socket.emit("debug", games);
    });


    /**
     *  log out handler
     */
    socket.on("disconnect", function() {
        console.log("Player logged out");
        if(index === 1) {
            let name = games[nbPlayersInGame][game][num]["name"];
            console.log("End of the game, " + name + " has left");
            for (let i=0; i<games[nbPlayersInGame][game].length; ++i) {
                //socket.emit("debug", games[nbPlayersInGame][game]["name"]);
                //games[nbPlayersInGame][game][i]["socket"].emit("disconnection", "End of the game, " + name + " has left.");
            }
            removeGame(nbPlayersInGame, game);
        }
        //socket.emit("debug", games);
    });

});
