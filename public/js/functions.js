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

    for (let i = 0; i < 10; i++) {
        let span = document.createElement("SPAN");
        span.classList.add("card");
        let divFront = document.createElement("DIV");
        divFront.classList.add("face", "pickFront");
        span.appendChild(divFront);
        let divBack = document.createElement("DIV");
        divBack.classList.add("face", "pickBack");
        span.appendChild(divBack);
        pick.appendChild(span);
    }

    //TODO : modify the positions of the cards of the pick
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

        [deck[index], deck[randomIndex]] = [
            deck[randomIndex], deck[index]];
    }

    return deck;
}

function getCards(hand) {
    for(let i = 0; i < hand.length; i++) {
        //find the current card
    }
}

function deal(deck, pick) {
    shuffle(deck);
    let card = "10";
    pick.firstElementChild.style.backgroundSize = "135px 198px";
    pick.firstElementChild.style.backgroundImage = "url('./pictures/cards/" + card + ".jpg')";
    pick.parentNode.classList.add("flip");
}

function randomCard() {
    let value = Math.floor(Math.random() * (98 - 2 + 1) + 2);
    return value.toString();
}

/**********************************************************************
 ***          useful functions to connect with the server           ***
 **********************************************************************/

function sendPlayerServer(sock, type_emit){
    var regex = /[a-zA-Z0-9._ -]+/;
    let name = prompt("Votre pseudo :");
    while ((name.trim().length === 0) || (name.match(regex) === null) || name.match(regex)[0] !== name){
        name = prompt("Pseudo invalide. Votre pseudo :");
    }

    /*Check number of players choosed*/
    let nbPlayers = document.querySelector("input:checked").value;

    /*Hide button "log in" and display "ready to play" one*/
    hide_DOM("radios");
    display_DOM("p_waiting");
    display_DOM("load", "inline");

    sock.emit(type_emit, name, nbPlayers);
}