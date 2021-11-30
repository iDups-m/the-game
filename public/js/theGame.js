"use strict";

document.addEventListener("DOMContentLoaded", function() {

    // socket open to the server
    let sock = io.connect();

    sock.on("error", function(msg) {
        alert(msg);
    });

    sock.on("players", function(players) {
        console.log(players);
        refreshTablePlayers(players);
    });

    sock.on("debug", function(games) {
        console.log(games);
    });


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


    /** To join the room */
    let btnJoin = document.getElementById("btnJoin");
    btnJoin.addEventListener("click", function (e) {
        sendPlayerServer(sock, "join_room");
    });

    /** To join the room created */
    let btnCreate = document.getElementById("btnCreate");
    btnCreate.addEventListener("click", function (e) {
        sendPlayerServer(sock, "create_room");
    });

    /** Afficher la partie : TEMPORAIRE */
    let btnPlay = document.getElementById("btnPlay");
    btnPlay.addEventListener("click", function (e) {
        hide_DOM("h1_welcome");
        hide_DOM("welcome");
        display_DOM("game");
    });

    let pick = document.getElementById("pick").lastElementChild;
    pick.addEventListener("click", function(e) {
        e.target.parentNode.classList.toggle("flip");
    });
});