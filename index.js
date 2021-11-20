"use strict";

// Chargement des modules 
var express = require('express');
var app = express();

// cf. https://www.npmjs.com/package/socket.io#in-conjunction-with-express
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(8080, function() {
    console.log("C'est parti ! En attente de connexion sur le port 8080...");
});

// Configuration d'express pour utiliser le répertoire "public"
app.use(express.static('public'));
// set up to 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/theGame.html');
});



/**********************************************************************
 ***                      Gestion des websockets                    ***
 **********************************************************************/

// réception d'une connexion
io.on('connection', function (socket) {

    // message de debug
    console.log("Un client s'est connecté");


    // essai :
    socket.emit("erreur", "Server en cours de construction.");


    /**
     *  Gestion des déconnexions
     */
    socket.on("disconnect", function() {
        console.log("Déconnexion d'un client");

    });

});
