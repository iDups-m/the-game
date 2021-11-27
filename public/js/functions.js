"use strict";

/**********************************************************************
 ***                  useful functions of the game                  ***
 **********************************************************************/

function shuffle(deck) {

}

function getCards(hand) {
    for(let i = 0; i < hand.length; i++) {
        //find the current card
    }
}

function deal(deck) {
    shuffle(deck);
}


/**********************************************************************
 ***          useful functions to connect with the server           ***
 **********************************************************************/

function sendPlayerServer(sock, type_emit){
    var regex = /[a-zA-Z]+/;
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