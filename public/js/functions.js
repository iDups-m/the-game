"use strict";

/**********************************************************************
 ***              useful functions to create the board              ***
 **********************************************************************/

function createHand(nbCards) {
    let hand = document.getElementById("hand");

    for (let i = 0; i < nbCards; i++) {
        let span = document.createElement("SPAN");
        span.classList.add("card");
        span.id = i.toString();
        let divFront = document.createElement("DIV");
        divFront.classList.add("faceCard", "handFront");
        span.appendChild(divFront);
        let divBack = document.createElement("DIV");
        divBack.classList.add("faceCard", "handBack");
        span.appendChild(divBack);
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
        span.id = "stack-"+i.toString();
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
        divFront.classList.add("face", "pick");
        span.appendChild(divFront);
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

/**********************************************************************
 ***                  useful functions of the game                  ***
 **********************************************************************/

function getNbCards(nbPlayers) {
    let nbCards;
    switch (parseInt(nbPlayers)) {
        case 2 :
            nbCards = 7;
            break;
        case 3 :
        case 4 :
            nbCards = 6;
            break;
        default :
            nbCards = 0;
            alert("Error : wrong number of players");
    }
    return nbCards;
}

function flipHand(card, cardNumber) {
    card.lastElementChild.style.backgroundImage = "url('./pictures/cards/"+cardNumber+".jpg')";
    card.classList.add("flip");
}

function deal(pick, arr) {
    for (let i = 0; i < arr.length; i++) {
        let handCard = document.getElementById(i.toString());
        handCard.firstElementChild.style.backgroundImage = "url('./pictures/pick.jpg')";
    }

    for (let i = 0; i < arr.length; i++) {
        let handCard = document.getElementById(i.toString());
        let cardNumber = arr[i];
        setTimeout(function() {flipHand(handCard, cardNumber)}, 1000);
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