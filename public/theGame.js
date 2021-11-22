document.addEventListener("DOMContentLoaded", function() {

    let sock = io.connect();

    /******************************************************************
     *                   Gestion de la socket                         *
     ******************************************************************/

    sock.on("erreur", function(msg) {
        alert(msg);
    });

    document.getElementById("board").addEventListener("click", function (e) {
        let card = e.target.parentNode;
        if (e.target.tagName === "DIV" && card.tagName === "SPAN") {
            card.classList.toggle("flip");
        }
    });
});