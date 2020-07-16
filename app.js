// Database & State
const db = firebase.database();
const dbGames = db.ref('/games/');
const dbUsers = db.ref('/users/');
const state = [];

// API call that loads data
dbGames.on('value', function (snapshot) {
    state.length = 0;
    snapshot.forEach(function (childSnapshot) {
        state.push(childSnapshot.val());
        calcTotalWins();
        calcTotalPoints();
        calcBlowouts();
        updateMarquee();
    });
});

$("#add-game-btn").hover(function () {
    $(this).addClass("hvr-bob");
}, function () {
    $(this).removeClass("hvr-bob");
});

// Show and hide game entry form
function showForm() {
    $('#add-game-form').addClass('hvr-bounce-in').show();
}

function hideForm() {
    $('#add-game-form').hide();
}

// Submit game entry form
$('a#submit').on('click', () => {
    writeGame();
    hideForm();
});

// Writes a new game to the database
function writeGame() {
    dbGames.push({
        playerOneId: 'monroeId',
        playerTwoId: 'cincoId',
        playerOneTeam: $('#player-one-team').val(),
        playerTwoTeam: $('#player-two-team').val(),
        playerOneScore: $('#player-one-score').val(),
        playerTwoScore: $('#player-two-score').val(),
    })
}

// Gets all scores from state
function getScores() {
    const p1Scores = state.map(function ({
        playerOneScore
    }) {
        return parseInt(playerOneScore, 10);
    });
    const p2Scores = state.map(function ({
        playerTwoScore
    }) {
        return parseInt(playerTwoScore, 10);
    });

    return [p1Scores, p2Scores];
}

// Calculates total number of wins for each user
function calcTotalWins() {
    const scores = getScores();
    const p1Scores = scores[0];
    const p2Scores = scores[1];

    let p1Wins = 0;
    let p2Wins = 0;

    // Iterates through scores and calculates winner 
    for (let i = 0; i < p1Scores.length; i++) {
        p1Scores[i] > p2Scores[i] ? p1Wins++ : p2Wins++;
    }

    displayWins(p1Wins, p2Wins);
}

// Calculates total number of points for each user
function calcTotalPoints() {
    const scores = getScores();
    const p1Scores = scores[0];
    const p2Scores = scores[1];

    const p1TotalPoints = p1Scores.reduce(function (a, b) {
        return a + b;
    }, 0);

    const p2TotalPoints = p2Scores.reduce(function (a, b) {
        return a + b;
    }, 0);

    displayTotalPoints(p1TotalPoints, p2TotalPoints);
}

// Calculates number of blowouts for each user
function calcBlowouts() {
    const scores = getScores();
    const p1Scores = scores[0];
    const p2Scores = scores[1];

    let p1Blowouts = 0;
    let p2Blowouts = 0;

    // Iterates through scores and determines if a game was blowout
    // blowout = score differential of at least 20 points
    for (let i = 0; i < p1Scores.length; i++) {

        if ((p1Scores[i] - p2Scores[i]) >= 20) {
            p1Blowouts++;
        } else if ((p2Scores[i] - p1Scores[i]) >= 20) {
            p2Blowouts++;
        }
    }

    displayBlowouts(p1Blowouts, p2Blowouts);
}

// Displays total wins for each player on scoreboard
function displayWins(p1TotalWins, p2TotalWins) {
    const p1TotalWinsStr = ('00' + p1TotalWins.toString()).slice(-2);
    const p2TotalWinsStr = ('00' + p2TotalWins.toString()).slice(-2);

    $("#home-wins").text(p1TotalWinsStr);
    $("#guest-wins").text(p2TotalWinsStr);
}

// Displays total points for each player on scoreboard
function displayTotalPoints(p1TotalPoints, p2TotalPoints) {
    $("#p1-tot-pts").text(p1TotalPoints);
    $("#p2-tot-pts").text(p2TotalPoints);
}

function displayBlowouts(p1Blowouts, p2Blowouts) {
    $("#p1-blowouts").text(p1Blowouts);
    $("#p2-blowouts").text(p2Blowouts);
}

// Displays teams & scores of latest game on scrolling marquee
function updateMarquee() {
    dbGames.limitToLast(1).on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            const game = childSnapshot.val();

            $('marquee').text(`
            ${game.playerOneTeam.toUpperCase()} VS ${game.playerTwoTeam.toUpperCase()}
            : ${game.playerOneScore} - ${game.playerTwoScore}
            `);
        });
    })
}



// Function Below is to show and hide the stats button on names
function show_hide() {
    var click = document.getElementById("drop-content");
    if (click.style.display === "none") {
        click.style.display = "block";
    } else {
        click.style.display = "none";
    }
}


// Determines the winner of a game and returns winner ID
// function getWinnerId(game) {
//     const finalScoreOneInt = parseInt(game.playerOneScore, 10);
//     const finalScoreTwoInt = parseInt(game.playerTwoScore, 10);

//     return finalScoreOneInt > finalScoreTwoInt
//         ? game.playerOneId
//         : game.playerTwoId;
// }

// Update the total wins prop on the user
// function updateWins(playerOneTeam) {
//     console.log(playerOneTeam);
//     const winnerId = getWinnerId(game);
//     const winner = state.users.find(user => user.id === winnerId)

//     winner.totalWins++
// }

// TODO make player name dynamic
// $("div#monroe-text-bg > p").text(playerOne.name.toUpperCase());