// $("button").on("click", function() {
//     let monroeTeam = prompt("Who was Monroe's team?");
//     let monroeScore = prompt("What was Monroe's score?")
//     let cincoTeam = prompt("Who was Cinco's team?");
//     let cincoScore = prompt("What was Cinco's score?")
// })

// Variables to store individual game stats
let monroeTeam
let monroeScore
let cincoTeam
let cincoScore

// Arrays to store all game stats
let allMonroeTeams = [];
let allMonroeScores = [];
let allCincoTeams = [];
let allCincoScores = [];

// Display Popup
function div_show() {
    document.getElementById('popupContact').style.display = "block";
}

// Hide Popup
function div_hide() {
    document.getElementById('popupContact').style.display = "none";
}

$('a#submit').on('click', function() {
    monroeTeam = document.getElementById("monroe-team").value;
    monroeScore = document.getElementById("monroe-score").value;
    cincoTeam = document.getElementById("cinco-team").value;
    cincoScore = document.getElementById("cinco-score").value;

    allMonroeTeams.push(monroeTeam);
    allMonroeScores.push(monroeScore);
    allCincoTeams.push(cincoTeam);
    allCincoScores.push(cincoScore);

    div_hide();
    updateScore();
    updateMarquee();

    console.log(monroeTeam);
    console.log(monroeScore);
    console.log(cincoTeam);
    console.log(cincoScore);

})

function updateScore() {

}

function updateMarquee() {
   let marquee = document.getElementById("marquee")
   marquee.innerHTML = monroeTeam.toUpperCase() + " VS " + cincoTeam.toUpperCase() + ": " + monroeScore + "-" + cincoScore;
}