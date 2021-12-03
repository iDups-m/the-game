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
// Counter of rooms
let nbRooms = {
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

/**
 *  Removed player in the game
 *  @param nbPlayers the number of the players in the room
 *  @param game the game to remove
 *  @param num the player to remove
 */
function removePlayer(nbPlayers, game, num) {
    console.log("Remove the player number " + num + " of the game " + game + " of " + nbPlayers + " players");
    delete games[nbPlayers][game][num];

}


/**********************************************************************
 ***                              websocket                         ***
 **********************************************************************/

// connection received
io.on('connection', function(socket) {

    // debug message
    console.log("player connected");

    let state = 0;                  // 0 : not connected, 1 : connected
    let nbPlayersInGame = null;     // the number players planed playing with the player in the room
    let index_room = null;          // the number of the room where the player is playing
    let index_player = null;        // the number of the player in the room

    /**
     *  Ask for a connection of the player.
     *  @param name the name of the player
     *  @param nbPlayers number of players in the room
     *  @param visibility "PUBLIC" or the name given
     */
    socket.on("join_room", function(name, nbPlayers, visibility) {
        // if player is already playing
        if(state === 1) {
            socket.emit("error_join", "Player already connected.");
            return;
        }

        // searching for a room in need of other players
        let roomFree = -1;
        for (let i = 0; i < nbRooms[nbPlayers]; ++i) {
            let length = Object.keys(games[nbPlayers][i]["players"]).length;
            if( (games[nbPlayers][i]["visibility"] === visibility) && (length < nbPlayers) ){
                roomFree = i;
                break;
            }
        }

        if(roomFree === -1){
            // Creation of a new room
            index_player = 0;
            index_room = nbRooms[nbPlayers];
            games[nbPlayers][index_room] = {
                visibility : visibility,
                players : {},
            };
            nbRooms[nbPlayers]++;

        } else {
            // verify that the name is not already used in the room
            let length = Object.keys(games[nbPlayers][roomFree]["players"]).length;
            let names = [];
            for (let i=0; i<length; ++i){
                names.push(Object.keys(games[nbPlayers][roomFree]["players"][i])[0]);
            }
            if(names.includes(name)){
                socket.emit("error_join", "A player with this name is already connected.");
                return;
            }

            index_room = roomFree;
            index_player = names.length; //TODO: à vérifier en cas de suppression de joueur
        }

        state = 1;
        nbPlayersInGame = nbPlayers;
        /*games[nbPlayers][index_room]["players"][index_player] = {
            [name] : socket,
        };*/
        games[nbPlayers][index_room]["players"][index_player] = {
            [name] : "la socket",
        };

        let length = Object.keys(games[nbPlayers][index_room]["players"]).length;
        let names = [];
        for (let i=0; i<length; ++i){
            names.push(Object.keys(games[nbPlayers][index_room]["players"][i])[0]);
        }

        socket.emit("players", {
            names : names,
            nbPlayers : nbPlayersInGame,
            visibility : visibility,
        });
        socket.emit("debug", games);
    });


    socket.on("create_room", function (name, nbPlayers, visibility){
        // if player is already playing
        if(state === 1) {
            socket.emit("error_join", "Player already connected.");
            return;
        }

        // if private room, verify that the name isn't already used
        if(visibility !== "PUBLIC"){
            for (let i = 0; i < nbRooms[nbPlayers]; ++i) {
                if(games[nbPlayers][i]["visibility"] === visibility ){
                    socket.emit("error_create", "This name of room is already taken");
                    return;
                }
            }
        }

        state = 1;
        index_room = nbRooms[nbPlayers];
        nbPlayersInGame = nbPlayers;
        index_player = 0; //first in the room

        games[nbPlayers][index_room] = {
            visibility : visibility,
            players : {},
        };
        /*games[nbPlayers][index_room][players][index_player] = {
            [name] : socket,
        };*/
        games[nbPlayers][index_room]["players"][index_player] = {
            [name] : "la socket",
        };
        nbRooms[nbPlayers]++;

        socket.emit("players", {
            names : Object.keys(games[nbPlayers][index_room]["players"][0]),
            nbPlayers : nbPlayersInGame,
            visibility : visibility,
        });
        socket.emit("debug", games);
    });


    /**
     *  log out handler
     */
    socket.on("disconnect", function() {
        console.log("Player logged out");

        if(state === 1) {
            let name = games[nbPlayersInGame][index_room]["players"][index_player][0];
            console.log("End of the game, " + name + " has left");

            let length = Object.keys(games[nbPlayersInGame][index_room]["players"]).length;
            for (let i=0; i<length; ++i){
                //games[nbPlayersInGame][index_room]["players"][i][0].emit("disconnection", "End of the game, " + name + " has left.");
            }

            // If game has begin
            //removeGame(nbPlayersInGame, game);

            // For the moment :
            //removePlayer(nbPlayersInGame, game, num);

            state = 0;
        }
    });

});
