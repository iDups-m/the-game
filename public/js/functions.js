"use strict";

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