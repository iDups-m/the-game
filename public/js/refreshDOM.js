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


/**
 * Function that refresh the table of players. Called the server return new players
 * @param players object with an array of name of players, the number of players and the visibility of the room
 */
function refreshTablePlayers(players) {
    console.log(players);
    document.getElementById("tblPlayers").textContent = ''; //to remove every children
    prepareTablePlayersDom();
    for (const player in players.names) {
        addPlayer(players.names[player]);
    }

    if (document.getElementById("h2_room_planned") == null){
        let h2 = document.createElement("h2");
        h2.id = "h2_room_planned";
        if (players.visibility === "PUBLIC") {
            h2.textContent = "Public room planned for " + players.nbPlayers + " players.";
        } else {
            h2.textContent = "Private room planned for " + players.nbPlayers + " players. Name of the room : " + players.visibility;
        }
        document.getElementById("sectionPlayers").insertBefore(h2, document.getElementById("p_co"));
    }
}