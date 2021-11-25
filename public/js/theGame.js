"use strict";



document.addEventListener("DOMContentLoaded", function() {

    // socket open to the server
    var sock = io.connect();

    sock.on("error", function(msg) {
        alert(msg);
    });

    /** To connect */
    let btnConnect = document.getElementById("btnConnect");
    btnConnect.addEventListener("click", function (e) {
        let name = prompt("Votre pseudo :");
        while (name.length === 0){
            name = prompt("Pseudo invalide. Votre pseudo :");
            //TODO : faire d'autres vérifications sur le nom :
            // - Ne contient pas juste une chaine vide (ex: " ", "\t"...)
            // - Ne contient pas d'éléments html
            // -> Utiliser le TP1 je pense
        }


        /*Update players in the DOM*/
        let tblPlayers = document.getElementById("tblPlayers");

        if(tblPlayers.children.length === 0){
            let sectionPlayers = document.getElementById("sectionPlayers");
            sectionPlayers.style.display = "block";
            prepareTablePlayersDom();
        }

        addPlayer(name);

        /*Hide button "log in" and display "ready to play" one*/
        replaceBtnConnectionPlay();

        sock.emit("log_in", name);

    });

    /** Start the game */
    let btnStart = document.getElementById("btnStart");
    btnStart.addEventListener("click", function (e) {
        remove_welcome();
        print_board();
    });

});