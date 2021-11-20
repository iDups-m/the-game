document.addEventListener("DOMContentLoaded", function() {

    // socket ouverte vers le serveur
    let sock = io.connect();




    /******************************************************************
     *                   Gestion de la socket                         *
     ******************************************************************/

    sock.on("erreur", function(msg) {
        alert(msg);
    });


});