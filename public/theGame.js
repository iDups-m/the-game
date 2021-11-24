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



document.addEventListener("DOMContentLoaded", function() {

    // To hide the board
    let game = document.getElementById("game");
    game.style.display = "none";

    /**
     * Functions which modify DOM :
     */
    function remove_welcome(){
        let div = document.getElementById("welcome");
        div.style.display = "none";
    }
    function print_board(){
        let div = document.getElementById("game");
        div.style.display = "block";
    }

    document.addEventListener("DOMContentLoaded", function () {
        let sock = io.connect();
    });


    /** Start the game */
    let btnStart = document.getElementById("btnStart");
    btnStart.addEventListener("click", function (e) {

        //alert("Go !");
        remove_welcome();
        print_board();
    });

});