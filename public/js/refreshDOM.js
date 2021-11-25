"use strict";

/**********************************************************************
 ***                  useful functions for the display             ***
 **********************************************************************/

/**
 * Functions that transforme a welcome display to a game display
 */
function remove_welcome(){
    let div = document.getElementById("welcome");
    div.style.display = "none";
}
function print_board(){
    let div = document.getElementById("game");
    div.style.display = "block";
}
function replaceBtnConnectionPlay(){
    let btnConnect = document.getElementById("btnConnect");
    btnConnect.style.display = "none";
    let btnStart = document.getElementById("btnStart");
    btnStart.style.display = "inline";
}

/*
* Fonction qui crer les différentes sections de la table de dépense.
* Elle est appellée uniquement lors de l'ajout de la première dépense.
* Argument : la liste d'amis du remboursement.
* Ne renvoie rien.
*/
function prepareTablePlayersDom(player){
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let thPlayer = document.createElement("th");
    thPlayer.textContent = "Player";
    let thState = document.createElement("th");
    thState.textContent = "State";
    tr.appendChild(thPlayer);
    tr.appendChild(thState);

    thead.appendChild(tr);
    document.getElementById("tblPlayers").appendChild(thead);

    let tbody = document.createElement("tbody");
    document.getElementById("tblPlayers").appendChild(tbody);
}


/*
* Fonction qui ajoute une dépense dans la table des dépenses du DOM.
* Arguments : le libelle, le montant, le payeur de la dépense ainsi que la liste des amis et des depenses.
* Ne renvoie rien.
*/
function addPlayer(name){
    let tr = document.createElement("tr");
    let tdName = document.createElement("td");
    tdName.textContent = name;
    tr.appendChild(tdName);
    let tdState = document.createElement("td");
    tdState.textContent = "Waiting...";
    tr.appendChild(tdState);
    document.querySelector("tbody").appendChild(tr);
}

function toggleStatePlayers(name){

}
