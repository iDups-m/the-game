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
 *  Removed the room from games
 *  @param nbPlayers the number of the players of the room
 *  @param index_room the room to remove
 */
function removeRoom(nbPlayers, index_room) {
    console.log("Remove the room " + index_room + " of " + nbPlayers + " players");
    delete games[nbPlayers][index_room];
}

/**
 *  Removed the player from the room
 *  @param nbPlayers the number of the players of the room
 *  @param index_room the room to remove
 *  @param index_player the player to remove
 */
function removePlayer(nbPlayers, index_room, index_player) {
    console.log("Remove the player number " + index_player + " of the room " + index_room + " of " + nbPlayers + " players");
    delete games[nbPlayers][index_room]["players"][index_player];
}

/**
 * Send players information to all players in the room
 * Call when a player left or enter the room
 * @param nbPlayers the number of the players of the room
 * @param index_room the room
 */
function sendPlayers(nbPlayers, index_room) {
    let length = Object.keys(games[nbPlayers][index_room]["players"]).length;
    let visibility = games[nbPlayers][index_room]["visibility"];
    let names = [];
    for (let i=0; i<length; ++i){
        if(games[nbPlayers][index_room]["players"][i]){
            let name = Object.keys(games[nbPlayers][index_room]["players"][i])[0];
            names.push(name);
        }
    }
    for (let i=0; i<length; ++i){
        if(games[nbPlayers][index_room]["players"][i]){
            let name = Object.keys(games[nbPlayers][index_room]["players"][i])[0];
            games[nbPlayers][index_room]["players"][i][name].emit("players", {
                names: names,
                nbPlayers: nbPlayers,
                visibility: visibility,
            });
        }
    }
}

/**
 * Send to every players that the game begin and create the deck
 * @param nbPlayers the number of the players of the room
 * @param index_room the room
 */
function startGame(nbPlayers, index_room) {
    let length = Object.keys(games[nbPlayers][index_room]["players"]).length;
    for (let i=0; i<length; ++i){
        if(games[nbPlayers][index_room]["players"][i]){
            let name = Object.keys(games[nbPlayers][index_room]["players"][i])[0];
            games[nbPlayers][index_room]["players"][i][name].emit("start", nbPlayers);
        }
    }

    createDeck(nbPlayers, index_room);
}

/**
 * Had every cards of the deck (2 - 98)
 * @param nbPlayers the number of the players of the room
 * @param index_room the room
 */
function createDeck(nbPlayers, index_room) {
    for (let i = 2; i < 98; i++) {
        games[nbPlayers][index_room]["deck"].push(i);
    }
}

/**
 * Get one card from the deck (from remaining cards)
 * @param nbPlayers the number of the players of the room
 * @param index_room the room
 * @returns {string} the number of the card
 */
function getCard(nbPlayers, index_room) {
    let index = Math.floor(Math.random() * games[nbPlayers][index_room]["deck"].length);
    let value = games[nbPlayers][index_room]["deck"][index];
    return value.toString();
}


/**
 * Get one card from the deck (from remaining cards)
 * @param nbPlayers the number of the players of the room
 * @param index_room the room
 * @returns {string} the number of the card
 */
function getCard(nbPlayers, index_room) {
    let index = Math.floor(Math.random() * games[nbPlayers][index_room]["deck"].length);
    let value = games[nbPlayers][index_room]["deck"][index];
    return value.toString();
}

/**
 * Send players information to all players in the room
 * Call when a player left or enter the room
 * @param nbPlayers the number of the players of the room
 * @param index_room the room
 */
function updateGame(nbPlayers, index_room) {
    let length = Object.keys(games[nbPlayers][index_room]["players"]).length;
    for (let i=0; i<length; ++i){
        if(games[nbPlayers][index_room]["players"][i]){
            let name = Object.keys(games[nbPlayers][index_room]["players"][i])[0];
            games[nbPlayers][index_room]["players"][i][name].emit("updateGame", games[nbPlayers][index_room]["heaps"]);
        }
    }
}


/**********************************************************************
 ***                              websocket                         ***
 **********************************************************************/

// connection received
io.on('connection', function(socket) {

    // debug message
    console.log("player connected");

    let state = -1;                  // -1 : not connected, 0 : connected, 1 : playing
    let nbPlayersInGame = null;     // the number players planed playing with the player in the room
    let index_room = null;          // the number of the room where the player is playing
    let index_player = null;        // the number of the player in the room

    /**
     *  Ask for a connection to join a room of the player.
     *  @param name the name of the player
     *  @param nbPlayers number of players in the room
     *  @param visibility "PUBLIC" or the name given
     */
    socket.on("join_room", function(name, nbPlayers, visibility) {
        // if player is already connected or playing
        if(state !== -1) {
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
                deck : [], // Deck of the game (remaining cards)
                heaps : {   // Value on top of the four heap
                    0 : null,       // increasing heap
                    1 : null,       //      "
                    2 : null,       // decreasing heap
                    3 : null,       //      "
                },
            };
            nbRooms[nbPlayers]++;

        } else {
            // verify that the name is not already used in the room
            let length = Object.keys(games[nbPlayers][roomFree]["players"]).length;
            let names = [];
            for (let i=0; i<length; ++i){
                if(games[nbPlayers][roomFree]["players"][i]){
                    names.push(Object.keys(games[nbPlayers][roomFree]["players"][i])[0]);
                }
            }
            if(names.includes(name)){
                socket.emit("error_join", "A player with this name is already connected.");
                return;

                //TODO : creation of a room...
            }

            index_room = roomFree;
            index_player = names.length; //TODO: à vérifier en cas de suppression de joueur
        }

        state = 0;
        nbPlayersInGame = nbPlayers;
        games[nbPlayers][index_room]["players"][index_player] = {
            [name] : socket,
        };

        sendPlayers(nbPlayers, index_room);
        //socket.emit("debug", games);

        if(Object.keys(games[nbPlayers][index_room]["players"]).length == nbPlayersInGame){
            // Room completed
            startGame(nbPlayers, index_room);
        }
    });


    /**
     *  Ask for a connection to create a room of the player.
     *  @param name the name of the player
     *  @param nbPlayers number of players in the room
     *  @param visibility "PUBLIC" or the name given
     */
    socket.on("create_room", function (name, nbPlayers, visibility){
        // if player is already connected or playing
        if(state !== -1) {
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

        state = 0;
        index_room = nbRooms[nbPlayers];
        nbPlayersInGame = nbPlayers;
        index_player = 0; //first in the room
        nbRooms[nbPlayers]++;

        games[nbPlayers][index_room] = {
            visibility : visibility,
            players : {},
            deck : [],          // Deck of the game (remaining cards)
            heaps : {           // Value on top of the four heap
                0 : null,       // increasing heap
                1 : null,       //      "
                2 : null,       // decreasing heap
                3 : null,       //      "
            },
        };
        games[nbPlayers][index_room]["players"][index_player] = {
            [name] : socket,
        };

        socket.emit("players", {
            names : Object.keys(games[nbPlayers][index_room]["players"][0]),
            nbPlayers : nbPlayersInGame,
            visibility : visibility,
        });
        //socket.emit("debug", games);
    });

    /**
     * Ask for random cards from the deck for the head
     * Only call at the beginning of the game
     * @param nbCards number of cards in the hand, depend
     */
    socket.on("getHand", function(nbCards) {
        if(games[nbPlayersInGame][index_room]["deck"] == null){
            socket.emit("error", "No deck, no game.");
            return;
        }
        if(games[nbPlayersInGame][index_room]["deck"].length < nbCards){
            socket.emit("error", "Empty deck.");
        }

        let cards = [];
        for(let i=0; i<nbCards; ++i){
            cards.push(getCard());
        }

        socket.emit("hand", cards);
    });


    /**
     * Ask for one random card from the deck
     */
    socket.on("getCard", function() {
        if(games[nbPlayersInGame][index_room]["deck"] == null){
            socket.emit("error", "No deck, no game.");
            return;
        }

        if(games[nbPlayersInGame][index_room]["deck"].length === 0){
            socket.emit("error", "Empty deck.");
        }

        socket.emit("newCard", getCard());
    });


    /**
     * Ask to had a new card on one heap
     * @param heap number of the heap (0/1 -> increasing,   2/3 -> decreasing)
     * @param value value of the card
     */
    socket.on("play", function(heap, value) {
        if( (heap < 0) || (heap > 3)){
            socket.emit("error", "Not valid heap.");
            return;
        }
        if( (value < 2) || (value > 98)){
            socket.emit("error", "Not valid heap.");
            return;
        }

        // TODO : verifications

        games[nbPlayersInGame][index_room]["heaps"][heap] = value;
        updateGame(nbPlayersInGame, index_room);
    });


    /**
     *  log out handler
     */
    socket.on("disconnect", function() {

        if(state === 0) {
            // room isn't yet playing

            let name = Object.keys(games[nbPlayersInGame][index_room]["players"][index_player]);
            console.log("Player " + name + " logged out");

            sendPlayers(nbPlayersInGame, index_room);
            removePlayer(nbPlayersInGame, index_room, index_player);
        }

        if(state === 1) {
            // game in progress

            let name = Object.keys(games[nbPlayersInGame][index_room]["players"][index_player]);
            console.log("End of the game, " + name + " has left");

            removeRoom(nbPlayersInGame, index_room);
        }

        state = -1;

    });

});
