"use strict";

document.addEventListener("DOMContentLoaded", function() {

    // socket open to the server
    let sock = io.connect();

    /** Join a room */
    let btnJoinRoom = document.getElementById("btnJoinRoom");
    btnJoinRoom.addEventListener("click", function (e) {
        hide_DOM("p_welcome");
        hide_DOM("btn");
        display_DOM("radios");
        hide_DOM("btnCreate");
    });

    /** Create a room */
    let btnCreateRoom = document.getElementById("btnCreateRoom");
    btnCreateRoom.addEventListener("click", function (e) {
        hide_DOM("p_welcome");
        hide_DOM("btn");
        display_DOM("radios");
        hide_DOM("btnJoin");
    });


    /** To join a room */
    let btnJoin = document.getElementById("btnJoin");
    btnJoin.addEventListener("click", function (e) {
        sendPlayerServer(sock, "join_room");
    });

    /** To join a room created */
    let btnCreate = document.getElementById("btnCreate");
    btnCreate.addEventListener("click", function (e) {
        sendPlayerServer(sock, "create_room");
    });

    /******************************************************************
     *                   Listen of the socket                         *
     ******************************************************************/

    sock.on("error", function(msg) {
        alert(msg);
    });

    sock.on("players", function(players) {
        refreshTablePlayers(players);
    });

    sock.on("error_join", function(msg) {
        alert("Not possible to join the room. " + msg);
        location.reload();
    });
    sock.on("error_create", function(msg) {
        alert("Not possible to create the room. " + msg);
        location.reload();
    });

    sock.on("debug", function(games) {
        console.log(games);
    });

    let nbCards;

    let surrenderBtn = document.createElement("BUTTON");
    surrenderBtn.id = "surrenderBtn";
    surrenderBtn.innerHTML = "Surrender";

    sock.on("start", function (info) {
        hide_DOM("h1_welcome");
        hide_DOM("welcome");
        display_DOM("game");

        nbCards = getNbCards(info.numberPlayers);

        initBoard(nbCards);

        let game = document.getElementById("game");
        game.appendChild(surrenderBtn);

        sock.emit("getHand", nbCards, true);

        displayMessage(info, true);
    });

    surrenderBtn.addEventListener("click", function() {
        let nbCardsLeft = getNbCardsLeft();
        sock.emit("endGame", nbCardsLeft);
    });

    sock.on("hand", function(arr) {
        setTimeout(function() {deal(arr)}, 1000);
    });

    let heap;
    let value;

    let hand = document.getElementById("hand");
    hand.addEventListener("click", function(e) {
        let span = e.target.parentNode;

        if (span.classList.contains("flip")) {
            value = e.target.style.backgroundImage.substr(22, 2);
            value = parseInt(value);
            if (!Number.isInteger(value)) {
                value = value.charAt(0);
            }
        }

        if (heap && value) {
            sock.emit("play", heap, value);
            heap = undefined;
            value = undefined;
        }
    });

    let stack = document.getElementById("stack");
    stack.addEventListener("click", function(e) {
        let span = e.target.parentNode;
        heap = span.id.charAt(6);

        if (heap && value) {
            sock.emit("play", heap, value);
            heap = undefined;
            value = undefined;
        }
    });

    let pick = document.getElementById("pick");
    pick.addEventListener("click", function() {
        let nbNewCards = nbCards - document.getElementsByClassName("flip").length;
        sock.emit("getHand", nbNewCards, false);
    });

    sock.on("newHand", function(arr) {
        refillHand(arr, nbCards);
    });

    let cardsLeft;

    sock.on("updateGame", function(heaps) {
        updateStack(heaps);
        cardsLeft = getNbCardsLeft();
    });

    if (cardsLeft === 0) {
        sock.emit("endGame", 0);
    }

    sock.on("nextCurrent", function(info) {
        displayMessage(info, false, true);
    });

    let btnSend = document.getElementById("btnSend");
    btnSend.addEventListener("click", function() {
        let message, heap;

        let valid = true;

        message = document.getElementById("selectMessage").value;
        heap = document.getElementById("selectHeap").value;
        if (message === "message") {
            alert("Choose a message to display !");
            valid = false;
        } else if (heap === "heap") {
            alert("Choose a number of heap !");
            valid = false;
        }

        if (valid) {
            let msg = message+" number "+heap;
            sock.emit("sendMsg", msg);
        }
    });

    sock.on("message", function(obj) {
        displayMessage(obj, false, false, 1);
    });

    let endTurnBtn = document.createElement("BUTTON");
    endTurnBtn.id = "endTurnBtn";
    endTurnBtn.innerHTML = "End Turn";

    sock.on("emptyDeck", function() {
        alert("emptyDeck");

        let pick = document.getElementById("pick");
        pick.style.visibility = "hidden";

        let game = document.getElementById("game");
        game.appendChild(endTurnBtn);
    });

    endTurnBtn.addEventListener("click", function() {
        sock.emit("endPlay");
    });

    sock.on("endGame", function(msg) {
        alert(msg);
        location.reload();
    });


});

document.addEventListener("keypress", function(e) {
    if (e.key === 'D' && e.shiftKey === true) {
        let chat = document.getElementsByTagName("ASIDE")[0];
        let paragraphs = chat.getElementsByTagName("P");
        chat.classList.toggle("dark");
        if (chat.classList.contains("dark")) {
            for (let i = 0; i < paragraphs.length; i++) {
                paragraphs[i].style.color = "white";
            }
        } else {
            for (let i = 0; i < paragraphs.length; i++) {
                paragraphs[i].style.color = "black";
            }
        }
    }
});