"use strict";

/**********************************************************************
 ***              functions for the display of the DOM              ***
 **********************************************************************/

/**
 * Functions that display or hide a section
 */
function display_DOM(id_of_element, display = "block"){
    let element = document.getElementById(id_of_element);
    element.style.display = display;
}
function hide_DOM(id_of_element){
    let element = document.getElementById(id_of_element);
    element.style.display = "none";
}


/**
* Fonction that create differents section of the table of players.
*/
function prepareTablePlayersDom(){
    let sectionPlayers = document.getElementById("sectionPlayers");
    sectionPlayers.style.display = "block";

    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let thPlayer = document.createElement("th");
    thPlayer.textContent = "Player";

    thead.appendChild(tr);
    document.getElementById("tblPlayers").appendChild(thead);

    let tbody = document.createElement("tbody");
    document.getElementById("tblPlayers").appendChild(tbody);
}


/**
* Fonction that add a player and his state in the table of players.
* @param name the name of the player
*/
function addPlayer(name){
    let tr = document.createElement("tr");
    let tdName = document.createElement("td");
    tdName.textContent = name;
    tr.appendChild(tdName);
    document.querySelector("tbody").appendChild(tr);
}

function toggleStatePlayers(name){

}

/**
 * Function that refresh the table of players. Called the server return new players
 * @param players array of name of players
 */
function refreshTablePlayers(players){
    document.getElementById("tblPlayers").textContent = ''; //to remove every children
    prepareTablePlayersDom();
    if(!Array.isArray(players)){
        addPlayer(players);
        return;
    }

    for (const player in players) {
        addPlayer(player);
    }
}