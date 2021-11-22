/**********************************************************************
 ***                  useful functions of the game                  ***
 **********************************************************************/

function createCard(faceClass, specClass) {
    let span = document.createElement("SPAN");
    span.classList.add("card");
    let div = document.createElement("DIV");
    div.classList.add(faceClass, specClass);
    span.appendChild(div);
    return span;
}

document.addEventListener("DOMContentLoaded", function() {
    let sock = io.connect();

    document.getElementById("base")

    /*document.getElementById("board").addEventListener("click", function (e) {
        let card = e.target.parentNode;
        if (e.target.tagName === "DIV" && card.tagName === "SPAN") {
            card.classList.toggle("flip");
        }
    });*/
});