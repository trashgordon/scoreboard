// Variables to store individual game stats
let monroeChosenTeam
let cincoChosenTeam
let monroeFinalScore
let cincoFinalScore
let monroeTotalWins = 0
let cincoTotalWins = 0
let pad = '00';

function showForm() {
    document.getElementById('add-game-form').style.display = 'block';
}

function hideForm() {
    document.getElementById('add-game-form').style.display = 'none';
}

$('a#submit').on('click', function() {
    monroeChosenTeam = document.getElementById("monroe-team").value;
    monroeFinalScore = document.getElementById("monroe-score").value;
    cincoChosenTeam = document.getElementById("cinco-team").value;
    cincoFinalScore = document.getElementById("cinco-score").value;

    hideForm();
    updateScore(monroeFinalScore, cincoFinalScore);
    updateMarquee();
})

function updateScore(monroeFinalScore, cincoFinalScore) {
    if (Number(monroeFinalScore) > Number(cincoFinalScore)) {
        monroeTotalWins++
    } else {
        cincoTotalWins++
    }
    let monroeTotalWinsPadded = (pad + String(monroeTotalWins)).slice(-pad.length);
    let cincoTotalWinsPadded = (pad + String(cincoTotalWins)).slice(-pad.length);
    document.getElementById("left-score").innerHTML = monroeTotalWinsPadded;
    document.getElementById("right-score").innerHTML = cincoTotalWinsPadded;
}

function updateMarquee() {
   let marquee = document.querySelector("marquee")
   marquee.innerHTML = monroeChosenTeam.toUpperCase() + " VS " +
                       cincoChosenTeam.toUpperCase() + ": " +
                       monroeFinalScore + "-" + cincoFinalScore;
}