"use strict";

/**********************************************************************
 ***              useful functions to create the board              ***
 **********************************************************************/

function getNbCards(nbPlayers) {
    let nbCards;
    switch (parseInt(nbPlayers)) {
        case 2 : nbCards = 7;
        break;
        case 3 : nbCards = 6;
        break;
        case 4 : nbCards = 6;
        break;
    }
    return nbCards;
}

function createHand(nbCards) {
    let hand = document.getElementById("hand");

    for (let i = 0; i < nbCards; i++) {
        let span = document.createElement("SPAN");
        span.classList.add("card");
        let div = document.createElement("DIV");
        div.classList.add("faceCard", "hand");
        span.appendChild(div);
        hand.appendChild(span);
    }
}

function createBase() {
    let base = document.getElementById("base");

    for (let i = 0; i < 2; i++) {
        let span = document.createElement("SPAN");
        span.classList.add("card");
        let div = document.createElement("DIV");
        div.classList.add("face", "base1");
        span.appendChild(div);
        base.appendChild(span);
    }

    for (let i = 0; i < 2; i++) {
        let span = document.createElement("SPAN");
        span.classList.add("card");
        let div = document.createElement("DIV");
        div.classList.add("face", "base2");
        span.appendChild(div);
        base.appendChild(span);
    }
}

function createStack() {
    let stack = document.getElementById("stack");

    for (let i = 0; i < 4; i++) {
        let span = document.createElement("SPAN");
        span.classList.add("card");
        let div = document.createElement("DIV");
        div.classList.add("face", "stack");
        span.appendChild(div);
        stack.appendChild(span);
    }
}

function createPick() {
    let pick = document.getElementById("pick");

    let margin = -160;

    for (let i = 0; i < 10; i++) {
        let span = document.createElement("SPAN");
        span.classList.add("card");
        let divFront = document.createElement("DIV");
        divFront.classList.add("face", "pickFront");
        span.appendChild(divFront);
        let divBack = document.createElement("DIV");
        divBack.classList.add("face", "pickBack");
        span.appendChild(divBack);
        span.style.marginRight = margin+"px";
        margin += 1;
        pick.appendChild(span);
    }
}

function initBoard(nbCards) {
    createBase();
    createStack();
    createHand(nbCards);
    createPick();
}

function returnCard(style, cardSize, card) {
    style.transform = "rotateY(180deg)";
    style.transformStyle = "preserve-3d";
    style.transition = "all .4s ease-in-out";
    style.backfaceVisibility = "hidden";
    style.zIndex = "900";
    style.backgroundSize = cardSize;
    style.backgroundImage = "url('./pictures/cards/" + card + ".jpg')";
}

function moveCard(style) {
    style.transform = "translate(100px, 500px)";
    style.transition = "all .6s ease-int-out";
}

/**********************************************************************
 ***                  useful functions of the game                  ***
 **********************************************************************/

function deal(pick, nbCards) {
    const cardSize = "135px 198px";
    for (let i = 0; i < nbCards; i++) {
        let card = "10";
        pick.parentNode.classList.add("flip");
        returnCard(pick.firstElementChild.style, cardSize, card);
        moveCard(pick.firstElementChild.style);
    }
}

/**********************************************************************
 ***          useful functions to connect with the server           ***
 **********************************************************************/

/**
 * Ask the server in order to add a player in a room
 * @param sock socket of communication for the server
 * @param type_emit join or create a room
 */
function sendPlayerServer(sock, type_emit){
    var regex = /[a-zA-Z0-9._ -]+/;
    let name = prompt("Your name :");
    while ((name.trim().length === 0) || (name.match(regex) === null) || name.match(regex)[0] !== name){
        name = prompt("Not valid name. Your name :");
    }

    /*Check number of players choosed*/
    let nbPlayers = document.querySelector("input:checked").value;

    /*Check public or private room choosed*/
    let visibility = "PUBLIC";
    if(document.getElementById('private').checked) {
        visibility = prompt("The name of the room :");
        while ((visibility.trim().length === 0) || (visibility === "PUBLIC") || (visibility.match(regex) === null) || visibility.match(regex)[0] !== visibility){
            visibility = prompt("Not valid name. The name of the room :");
        }
    }

    /*Hide button "log in" and display "ready to play" one*/
    hide_DOM("radios");
    display_DOM("p_waiting");
    display_DOM("load", "inline");

    sock.emit(type_emit, name, nbPlayers, visibility);
}