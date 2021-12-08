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

    sock.on("debug", function(games) {
        console.log(games);
    });

    sock.on("error_join", function(msg) {
        alert("Not possible to join the room. " + msg);
        location.reload();
    });
    sock.on("error_create", function(msg) {
        alert("Not possible to create the room. " + msg);
        location.reload();
    });

    sock.on("start", function (info) {
        hide_DOM("h1_welcome");
        hide_DOM("welcome");
        display_DOM("game");

        let nbCards = getNbCards(info.numberPlayers);

        initBoard(nbCards);

        sock.emit("getHand", nbCards);

        alert("A toi de jouer : " + info.youBegin);
    });

    sock.on("hand", function(arr) {
        let pick = document.getElementById("pick").lastElementChild;
        setTimeout(function() {deal(pick, arr)}, 1000);
    });
});