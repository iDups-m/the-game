/******************************************************************
 *                   Listen of the socket                         *
 ******************************************************************/

document.addEventListener("DOMContentLoaded", function() {

    // socket open to the server
    var sock = io.connect();

    sock.on("error", function(msg) {
        alert(msg);
    });

    sock.on("players", function(msg) {
        console.log(msg);
    });

});