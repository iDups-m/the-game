"use strict";

/**********************************************************************
 ***              useful functions to create the board              ***
 **********************************************************************/

function createHand(nbCard = 7) {
    let hand = document.getElementById("hand");

    for (let i = 0; i < nbCard; i++) {
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

function initBoard() {
    createBase();
    createStack();
    createHand();
    createPick();
}

/**********************************************************************
 ***                  useful functions of the game                  ***
 **********************************************************************/

function createDeck(arr) {
    for (let i = 2; i < 98; i++) {
        arr.push(i);
    }
}

function shuffle(deck) {
    let index = deck.length;
    let randomIndex;

    while (index !== 0) {
        randomIndex = Math.floor(Math.random() * index);
        index--;
        [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
    }

    return deck;
}

function deal(deck, pick, nbCards) {
    const cardSize = "135px 198px";
    shuffle(deck);
    //deal the number of cards for the player
    /*for (let i = 0; i < nbCards; i++) {

    }*/
    /*if (document.getElementById("game").style.display !== "NONE") {
        let card = "10";
        pick.firstElementChild.style.backgroundSize = cardSize;
        pick.firstElementChild.style.backgroundImage = "url('./pictures/cards/" + card + ".jpg')";
        pick.parentNode.classList.add("flip");
    }*/
}

function randomCard() {
    let value = Math.floor(Math.random() * (98 - 2 + 1) + 2);
    return value.toString();
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

    /*Check public or public room choosed*/
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