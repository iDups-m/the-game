"use strict";

/**********************************************************************
 ***              useful functions to create the board              ***
 **********************************************************************/

/**
 * create the hand in the DOM structure
 * @param nbCards the number of cards to display in the hand of the player
 */
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

/**
 * create the base of the game in the DOM structure
 * it is the four card at the top of the screen
 */
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

/**
 * create the stacks of the game in the DOM structure
 */
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

/**
 * create the pick of the game in the DOM structure
 */
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

/**
 * initialize the board the game
 * @param nbCards the number of cards to display in the hand
 */
function initBoard(nbCards) {
    createBase();
    createStack();
    createHand(nbCards);
    createPick();
}

/**********************************************************************
 ***                  useful functions of the game                  ***
 **********************************************************************/

/**
 * get the number of cards in function of the number of players
 * @param nbPlayers the number of players in the game
 * @returns {number} the number of cards
 */
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

function getNbCardsLeft() {
    let cards = document.getElementById("hand").children;
    let res = cards.length;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].style.background === "white") {
            res--;
        }
    }
    console.log(res);
    return res;
}

/**
 * return a card on the hand
 * @param card the card to flip
 * @param cardNumber the number of the card to display
 */
function flipHand(card, cardNumber) {
    card.lastElementChild.style.backgroundImage = "url('./pictures/cards/"+cardNumber+".jpg')";
    card.classList.add("flip");
}

/**
 * return the cards at the beginning of the game
 * for all the players
 * @param arr the array with the value to display on the cards
 */
function deal(arr) {
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

/**
 * get a card on the hand in case of the value of the card
 * @param value the value of the card
 * @returns {null|Element} the card or null if the card is not in the hand
 */
function getHandCard(value) {
    let hand = document.getElementsByClassName("flip");
    for (let i = 0; i < hand.length; i++) {
        let ret = hand[i].lastElementChild.style.backgroundImage.substr(22, 2);
        ret = parseInt(ret);
        if (!Number.isInteger(ret)) {
            ret = ret.charAt(0);
        }
        if (ret === value) {
            return hand[i];
        }
    }
    return null;
}

/**
 * update the display of the stack/heap on the board of the game
 * @param heaps the array representation of the heaps
 * //example => [12, 34, 89, 1]
 */
function updateStack(heaps) {
    for (let i = 0; i < 4; i++) {
        let stack = document.getElementById("stack-"+i);
        stack.lastElementChild.style.backgroundImage = "url('./pictures/cards/"+heaps[i]+".jpg')";
        stack.lastElementChild.style.backgroundSize = "135px 198px";

        let card = getHandCard(heaps[i]);
        if (card) {
            card.classList.remove("flip");
            card.lastElementChild.style.backgroundImage = "none";
            card.firstElementChild.style.background = "white";
        }
    }
}

/**
 * refill the card in the hand that are empty
 * @param arr the arr of the new cards
 * @param nbHandCards the number of card in the hand in total
 */
function refillHand(arr, nbHandCards) {
    let index = 0;
    let nbCardsNeeded = 0;
    for (let i = 0; i < nbHandCards; i++) {
        let handCard = document.getElementById(i.toString());
        if (!handCard.classList.contains("flip")) {
            nbCardsNeeded++;
        }
    }
    for (let i = 0; i < nbHandCards; i++) {
        let handCard = document.getElementById(i.toString());
        if (!handCard.classList.contains("flip")) {
            if (index < arr.length) {
                handCard.lastElementChild.style.backgroundImage = "url('./pictures/cards/"+arr[index]+".jpg')";
                handCard.classList.add("flip");
                index++;
            } else {
                handCard.lastElementChild.style.background = "white";
            }
        }
    }
}

/**********************************************************************
 ***          useful functions for the chat of the game             ***
 **********************************************************************/

/**
 * create the timestamp who's on all messages
 * @returns {string} a string representative of the timestamp
 */
function timestamp() {
    let time = new Date(Date.now());
    let res = "";

    if (time.getHours() < 10) {
        res += "0";
    }
    let hours = time.getHours();
    res += hours+":";

    if (time.getMinutes() < 10) {
        res += "0";
    }
    res += time.getMinutes()+":";

    if (time.getSeconds() < 10) {
        res += "0";
    }
    res += time.getSeconds();

    return res;
}

/**
 * display the message with the right settings
 * @param obj the structure that return the server
 * @param messageType know the type of the message :
 * - 0 (server message)
 * - 1 (player message)
 * @param start true if it displays the start player
 * @param current the current player to play the turn
 */
function displayMessage(obj, start = false, current = false, messageType = 0) {
    let sentence = timestamp();

    sentence += " - ";

    (obj.author === true) ? sentence += "You" : sentence += obj.author;

    if (start) {
        sentence += " start the game";
    } else if (current) {
        sentence += " next to play";
    } else {
        sentence += " : ";
    }

    if (messageType === 1) {
        sentence += obj.message;
    }

    let aside = document.getElementsByTagName("ASIDE")[0];
    let p = document.createElement("P");
    p.textContent = sentence;
    p.style.color = "black";

    if (aside.children.length === 0) {
        aside.appendChild(p);
    } else {
        aside.insertBefore(p, aside.firstChild);
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