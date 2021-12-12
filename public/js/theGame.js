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

    sock.on("start", function (info) {
        hide_DOM("h1_welcome");
        hide_DOM("welcome");
        display_DOM("game");

        nbCards = getNbCards(info.numberPlayers);

        initBoard(nbCards);

        sock.emit("getHand", nbCards, true);

        displayMessage(info, 0);
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

    sock.on("updateGame", function(heaps) {
        updateStack(heaps);
    });

    sock.on("nextCurrent", function(info) {
        displayMessage(info, 0);
    });

    let btnSend = document.getElementById("btnSend");
    btnSend.addEventListener("click", function() {
        let message, heap;

        message = document.getElementById("selectMessage").value;
        heap = document.getElementById("selectHeap").value;

        let msg = message+" number "+heap;

        sock.emit("sendMsg", msg);
    });

    sock.on("message", function(obj) {
        displayMessage(obj, 1);
    });

    sock.on("emptyDeck", function() {
       //TODO : hide the heap and add button to end the turn
    });

    sock.on("endGame", function(msg) {
        alert(msg);
        location.reload();
    });
});