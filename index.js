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

let MIN_CARD = 2;
let MAX_CARD = 99;

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
    console.log("removeRoom receive with " + nbPlayers + " and " + index_room);
    if(!games[nbPlayers]?.[index_room]?.["players"]){
        return;
    }

    console.log("Remove the room " + index_room + " of " + nbPlayers + " players");
    let length = Object.keys(games[nbPlayers][index_room]["players"]).length;
    for (let i=0; i<length; ++i){
        if(games[nbPlayers]?.[index_room]?.["players"]?.[i]){
            let name = Object.keys(games[nbPlayers][index_room]["players"][i])[0];
            games[nbPlayers][index_room]["players"][i][name].emit("endGame", "Game lost, one player has left");
        }
    }

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
    let current = games[nbPlayers][index_room]["current"];
    let name_beginner = (Object.keys(games[nbPlayers][index_room]["players"][current]))[0];

    for (let i=0; i<length; ++i){
        if(games[nbPlayers][index_room]["players"][i]){
            let name = Object.keys(games[nbPlayers][index_room]["players"][i])[0];

            if(i === current){
                games[nbPlayers][index_room]["players"][i][name].emit("start", {
                    numberPlayers : nbPlayers,
                    author : true,
                });
            } else {
                games[nbPlayers][index_room]["players"][i][name].emit("start", {
                    numberPlayers : nbPlayers,
                    author : name_beginner,
                });
            }
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
    for (let i = MIN_CARD; i < MAX_CARD; i++) {
        games[nbPlayers][index_room]["deck"].push(i);
    }

    /* Shuffle deck (even if card will be taken randomly) */
    let index = games[nbPlayers][index_room]["deck"].length;
    let randomIndex;
    while (index !== 0) {
        randomIndex = Math.floor(Math.random() * index);
        index--;
        [games[nbPlayers][index_room]["deck"][index], games[nbPlayers][index_room]["deck"][randomIndex]] = [games[nbPlayers][index_room]["deck"][randomIndex], games[nbPlayers][index_room]["deck"][index]];
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
    games[nbPlayers][index_room]["deck"].splice(index, 1);
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

/**
 * Warn players of the room that the deck is empty
 * @param nbPlayers the number of the players of the room
 * @param index_room the room
 */
function warnEmptyDeck(nbPlayers, index_room) {
    let length = Object.keys(games[nbPlayers][index_room]["players"]).length;
    for (let i=0; i<length; ++i){
        if(games[nbPlayers][index_room]["players"][i]){
            let name = Object.keys(games[nbPlayers][index_room]["players"][i])[0];
            games[nbPlayers][index_room]["players"][i][name].emit("emptyDeck");
        }
    }
}

/**
 * Set next current player
 * @param nbPlayers the number of the players of the room
 * @param index_room the room
 */
function nextCurrentPlayer(nbPlayers, index_room){
    let current = games[nbPlayers][index_room]["current"];
    let index = -1;
    let currentSet = false;
    do {
        current = (current+1) % nbPlayers;
        if(!games[nbPlayers][index_room]["players"][current].finished){
            currentSet = true;
            games[nbPlayers][index_room]["current"] = current;
        }
        ++index;
    } while((!currentSet) && (index < nbPlayers));

    if(!currentSet){
        return; //error
    }

    let length = Object.keys(games[nbPlayers][index_room]["players"]).length;
    let name_beginner = (Object.keys(games[nbPlayers][index_room]["players"][current]))[0];

    for (let i=0; i<length; ++i){
        if(games[nbPlayers][index_room]["players"][i]){
            let name = Object.keys(games[nbPlayers][index_room]["players"][i])[0];

            if(i === current){
                games[nbPlayers][index_room]["players"][i][name].emit("nextCurrent", {
                    author : true,
                });
            } else {
                games[nbPlayers][index_room]["players"][i][name].emit("nextCurrent", {
                    author : name_beginner,
                });
            }
        }
    }
}


/**
 *  Player has stop the game, warn other players
 *  @param nbPlayers the number of the players of the room
 *  @param index_room the room to remove
 *  @param name_player name of player you end game
 *  @param msg_forYou message for you : lost / win ...
 *  @param msg_forOther message for others : lost / win
 */
function endGame(nbPlayers, index_room, name_player, msg_forYou, msg_forOther) {
    let length = Object.keys(games[nbPlayers][index_room]["players"]).length;
    for (let i=0; i<length; ++i){
        if(games[nbPlayers][index_room]["players"][i]){
            let name = Object.keys(games[nbPlayers][index_room]["players"][i])[0];
            if (name === name_player){
                games[nbPlayers][index_room]["players"][i][name].emit("endGame", msg_forYou);
            } else {
                games[nbPlayers][index_room]["players"][i][name].emit("endGame", msg_forOther);
            }
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

    let state = -1;                 // -1 : not connected, 0 : connected
    let nbPlayersInGame = null;     // the number players planed playing with the player in the room
    let index_room = null;          // the number of the room where the player is playing
    let index_player = null;        // the number of the player in the room
    let name_player = null;         // the name of the player
    let nbCardsPlayed = 0;          // to verify minimum cards played at each turn

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
            if(games[nbPlayers][i]) {
                let length = Object.keys(games[nbPlayers][i]["players"]).length;
                if ((games[nbPlayers][i]["visibility"] === visibility) && (length < nbPlayers)) {
                    roomFree = i;
                    break;
                }
            }
        }

        if(roomFree === -1){
            // Creation of a new room
            index_player = 0;
            index_room = nbRooms[nbPlayers];
            games[nbPlayers][index_room] = {
                visibility : visibility,    // PUBLIC or the name of the room
                current : -1,               // player whose turn to play
                players : {},               // all players
                deck : [],                  // Deck of the game (remaining cards)
                heaps : {                   // Value on top of the four heap
                    0 : null,               // increasing heap
                    1 : null,               //      "
                    2 : null,               // decreasing heap
                    3 : null,               //      "
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
                //socket.emit("error_join", "A player with this name is already connected.");
                //return;

                // Creation of a new room
                index_player = 0;
                index_room = nbRooms[nbPlayers];
                games[nbPlayers][index_room] = {
                    visibility : visibility,    // PUBLIC or the name of the room
                    current : -1,               // player whose turn to play
                    players : {},               // all players
                    deck : [],                  // Deck of the game (remaining cards)
                    heaps : {                   // Value on top of the four heap
                        0 : null,               // increasing heap
                        1 : null,               //      "
                        2 : null,               // decreasing heap
                        3 : null,               //      "
                    },
                };
                nbRooms[nbPlayers]++;
            } else {
                index_room = roomFree;
                index_player = names.length;
            }
        }

        state = 0;
        nbPlayersInGame = nbPlayers;
        name_player = name;
        games[nbPlayers][index_room]["players"][index_player] = {
            [name] : socket,
            "finished" : false,
        };

        sendPlayers(nbPlayers, index_room);

        if(Object.keys(games[nbPlayers][index_room]["players"]).length == nbPlayersInGame){
            // Room completed
            games[nbPlayers][index_room]["current"] = (Math.random() * nbPlayersInGame) | 0;
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
                if(games[nbPlayers][i]?.["visibility"] === visibility ){
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
        name_player = name;

        games[nbPlayers][index_room] = {
            visibility : visibility,    // PUBLIC or the name of the room
            current : -1,               // player whose turn to play
            players : {},               // all players
            deck : [],                  // Deck of the game (remaining cards)
            heaps : {                   // Value on top of the four heap
                0 : null,               // increasing heap
                1 : null,               //      "
                2 : null,               // decreasing heap
                3 : null,               //      "
            },
        };
        games[nbPlayers][index_room]["players"][index_player] = {
            [name] : socket,
            "finished" : false,
        };

        sendPlayers(nbPlayers, index_room);

    });


    /**
     * Ask for random cards from the deck for the head of the player
     * Call at the beginning of the game and when player has played
     * @param nbCards number of cards wanted
     * @param first true if getHand (begin of game), false if called after playing
     * Give minimum of cards between wanted cards and remaining cards in deck
     */
    socket.on("getHand", function(nbCards, first) {
        socket.emit("debug", games[nbPlayersInGame][index_room]["deck"]);

        // error : not connected player or game not started
        if (state === -1 || !games[nbPlayersInGame][index_room] || Object.keys(games[nbPlayersInGame][index_room]["players"]).length != nbPlayersInGame) {
            socket.emit("error", "No game in progress.");
            return;
        }
        // not for the player to play
        if( !first && (index_player !== games[nbPlayersInGame][index_room]["current"]) ) {
            socket.emit("error", "It's not your turn.");
            return;
        }

        if(games[nbPlayersInGame][index_room]["deck"] == null){
            socket.emit("error", "No deck, no game.");
            return;
        }
        let lengthDeck = games[nbPlayersInGame][index_room]["deck"].length;
        if(lengthDeck === 0){
            socket.emit("error", "Empty deck.");
            return;
        }

        if(!first) {
            if ((lengthDeck === 0) && (nbCardsPlayed < 1)) {
                socket.emit("error", "You must put at least one card.");
                return;
            }
            if ((lengthDeck > 0) && (nbCardsPlayed < 2)) {
                socket.emit("error", "You must put at least two cards.");
                return;
            }
        }

        let cards = [];
        for(let i=0; i<nbCards; ++i){
            cards.push(getCard(nbPlayersInGame, index_room));
            if(games[nbPlayersInGame][index_room]["deck"].length === 0){
                warnEmptyDeck(nbPlayersInGame, index_room);
                break;
            }
        }

        if(first) {
            socket.emit("hand", cards);
        } else {
            socket.emit("newHand", cards);

            // change current player
            nbCardsPlayed = 0;
            nextCurrentPlayer(nbPlayersInGame, index_room);
        }
    });


    /**
     * Client want to play a card (value) on one heap
     * @param heap number of the heap (0/1 -> increasing,   2/3 -> decreasing)
     * @param value value of the card
     */
    socket.on("play", function(heap, value) {
        // debug
        console.log("heap=" + heap + " - value=" + value);

        // error : not connected player or game not started
        if (state === -1 || !games[nbPlayersInGame][index_room] || Object.keys(games[nbPlayersInGame][index_room]["players"]).length != nbPlayersInGame) {
            socket.emit("error", "No game in progress.");
            return;
        }
        // not for the player to play
        if (index_player !== games[nbPlayersInGame][index_room]["current"]) {
            socket.emit("error", "It's not your turn.");
            return;
        }

        if( (heap < 0) || (heap > 3)){
            socket.emit("error", "Not valid heap.");
            return;
        }
        if( (value < 2) || (value > 98)){
            socket.emit("error", "Not valid heap.");
            return;
        }

        let oldValue = games[nbPlayersInGame][index_room]["heaps"][heap];
        //console.log("oldValue=" + oldValue);
        if(oldValue !== null) {
            let theHeap = Number(heap) + 1;
            if (heap < 2) {
                // increasing heap, new card must be bigger than the card on top of the heap or have 10 points less
                if ((oldValue > value) && (oldValue - 10 !== value)) {
                    socket.emit("error", "The new card must be bigger than that on top of the heap " + theHeap);
                    return;
                }
            } else {
                // decreasing heap, new card must be smaller than the card on top of the heap or have 10 points more
                if ((oldValue < value) && (oldValue + 10 !== value)) {
                    socket.emit("error", "The new card must be smaller than that on top of the heap " + theHeap);
                    return;
                }
            }
        }

        // send to players new state of game
        games[nbPlayersInGame][index_room]["heaps"][heap] = value;
        updateGame(nbPlayersInGame, index_room);
        ++nbCardsPlayed;
    });


    /**
     * Client want to finish playing (set next current player)
     * Only call when empty deck
     */
    socket.on("endPlay", function(){
        // error : not connected player or game not started
        if (state === -1 || !games[nbPlayersInGame][index_room] || Object.keys(games[nbPlayersInGame][index_room]["players"]).length != nbPlayersInGame || games[nbPlayersInGame][index_room]["deck"] == null) {
            socket.emit("error", "No game in progress.");
            return;
        }
        // not for the player to play
        if (index_player !== games[nbPlayersInGame][index_room]["current"]) {
            socket.emit("error", "It's not your turn.");
            return;
        }
        // deck not empty
        if(games[nbPlayersInGame][index_room]["deck"].length !== 0){
            socket.emit("error", "Empty not deck. You must click on deck to finish playing");
            return;
        }

        if(nbCardsPlayed < 1){
            socket.emit("error", "You must put at least one card.");
            return;
        }

        nbCardsPlayed = 0;
        nextCurrentPlayer(nbPlayersInGame, index_room); // change current player
    });


    /**
     * Client want to send a message (among those predefined so no verification necessary)
     * @param msg the message
     */
    socket.on("sendMsg", function(msg) {
        let length = Object.keys(games[nbPlayersInGame][index_room]["players"]).length;
        for (let i=0; i<length; ++i){
            if(games[nbPlayersInGame][index_room]["players"][i]){
                if(i === index_player){
                    socket.emit("message", {
                        author : true,
                        message : msg,
                    });
                    continue;
                }

                let name = Object.keys(games[nbPlayersInGame][index_room]["players"][i])[0];
                games[nbPlayersInGame][index_room]["players"][i][name].emit("message", {
                    author : name_player,
                    message : msg,
                });
            }
        }
    });


    /**
     * Client has finished game
     * @param surrender true if client want to given up, false if empty hand
     */
    socket.on("endGame", function(surrender){
        if(surrender){
            console.log("Player " + name_player + " has surrender");
            endGame(nbPlayersInGame, index_room, name_player, "Game lost, you have given up." , "A player of your team has given up.");
        } else {
            games[nbPlayersInGame][index_room]["players"][index_player].finished = true;
            let length = Object.keys(games[nbPlayersInGame][index_room]["players"]).length;
            let finished = true;
            for (let i=0; i<length; ++i){
                if(games[nbPlayersInGame][index_room]["players"][i]){
                    if(!games[nbPlayersInGame][index_room]["players"][i].finished){
                        finished = false;
                    }
                }
            }

            if(finished){
                // Game finished, players won !
                endGame(nbPlayersInGame, index_room, null, "Game won ! Congratulation !", "Game won ! Congratulation !")
            }

        }
    });


    /**
     *  log out handler
     */
    socket.on("disconnect", function() {

        if(state !== -1) {
            console.log("Player " + name_player + " logged out");

            if((games[nbPlayersInGame][index_room]) && (games[nbPlayersInGame][index_room]["players"])) {
                if (Object.keys(games[nbPlayersInGame][index_room]["players"]).length != nbPlayersInGame) {
                    // room not already playing
                    removePlayer(nbPlayersInGame, index_room, index_player);
                    sendPlayers(nbPlayersInGame, index_room);
                } else {
                    // remove playing room
                    console.log("End of the game, " + name_player + " has left");
                    removeRoom(nbPlayersInGame, index_room);
                }
            }

            state = -1;
            nbPlayersInGame = null;
            index_room = null;
            index_player = null;
            name_player = null;
            nbCardsPlayed = 0;
        }

    });

});
