"use strict";

let deck = [];
let playing = false;

document.addEventListener("DOMContentLoaded", function() {
    createDeck(deck);

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

    /** TEMPORARY */
    let btnPlay = document.getElementById("btnPlay");
    btnPlay.addEventListener("click", function (e) {
        hide_DOM("h1_welcome");
        hide_DOM("welcome");
        display_DOM("game");
    });

    /** flip the card on the top of the pick */
    let pick = document.getElementById("pick").lastElementChild;
    deal(deck, pick);
    /*pick.addEventListener("click", function(e) {
        if (!e.target.parentNode.classList.contains("flip")) {
            let card = "10";
            e.target.style.backgroundSize = "135px 198px";
            e.target.style.backgroundImage = "url('./pictures/cards/" + card + ".jpg')";
            e.target.parentNode.classList.add("flip");
        } else {
            e.target.style.transform = "translate(100px, 500px)";
            e.target.style.transition = "all .6s ease-int-out";

        }
    });*/


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


});