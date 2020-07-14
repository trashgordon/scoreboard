
// Database
const db = firebase.database().ref();
const dbGames = firebase.database().ref('/games/');
const dbUsers = firebase.database().ref('/users/');
const state = []
// // API call that loads data
dbGames.on('value', function(snapshot) {
    state.length = 0;
    snapshot.forEach(function(childSnapshot) {
        state.push(childSnapshot.val());
        calcWins();
        updateMarquee();
    });
});    

console.log(state);
// iterate through the games and calculate totalWins for each user

function calcWins() {
    const p1Score = state.map(({playerOneScore}) => playerOneScore);
    const p2Score = state.map(({playerTwoScore}) => playerTwoScore);

    let p1Wins = 0;
    let p2Wins = 0;

    for (let i = 0; i < p1Score.length; i++) {

        if (parseInt(p1Score[i]) > parseInt(p2Score[i])) {
            p1Wins++;
        } else {
            p2Wins++;
        }
    }
    displayWins(p1Wins, p2Wins);
    calcTotalPoints();

}

function calcTotalPoints() {
    const p1Score = state.map(({playerOneScore}) => playerOneScore);
    const p2Score = state.map(({playerTwoScore}) => playerTwoScore);

    const p1TotalPoints = p1Score.reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const p2TotalPoints = p2Score.reduce((a, b) => parseInt(a) + parseInt(b), 0);

    console.log(p1TotalPoints);
    console.log(p2TotalPoints);
}


// games.reduce((acc, cur) => {
//     // sum up all the wins - maybe use getWinner function
// }, { playerOneWins: 0, playerTwoWins: 0 })

// Game factory creates game
// const createGame = () => ({
//         playerOneId: 'monroeId',
//         playerTwoId: 'cincoId',
//         playerOneTeam: $('#player-one-team').val(),
//         playerTwoTeam: $('#player-two-team').val(),
//         playerOneScore: $('#player-one-score').val(),
//         playerTwoScore: $('#player-two-score').val(),
// });

function writeGame()  {
    dbGames.push({
        playerOneId: 'monroeId',
        playerTwoId: 'cincoId',
        playerOneTeam: $('#player-one-team').val(),
        playerTwoTeam: $('#player-two-team').val(),
        playerOneScore: $('#player-one-score').val(),
        playerTwoScore: $('#player-two-score').val(),
})}

// TODO make player name dynamic
// $("div#monroe-text-bg > p").text(playerOne.name.toUpperCase());


// Show and hide game entry form
function showForm() {
    document.getElementById('add-game-form').style.display = 'block';
}
function hideForm() {
    document.getElementById('add-game-form').style.display = 'none';
}

// Submit game entry form
$('a#submit').on('click', () => {
    writeGame();
    hideForm();
});

// Determines the winner of a game and returns winner ID
function getWinnerId(game) {
    const finalScoreOneInt = parseInt(game.playerOneScore, 10);
    const finalScoreTwoInt = parseInt(game.playerTwoScore, 10);

    return finalScoreOneInt > finalScoreTwoInt
        ? game.playerOneId
        : game.playerTwoId;
}

// Update the total wins prop on the user
function updateWins(playerOneTeam) {
    console.log(playerOneTeam);
    const winnerId = getWinnerId(game);
    const winner = state.users.find(user => user.id === winnerId)

    winner.totalWins++
}

// Shows the wins on the scoreboard
function displayWins(playerOneWins, playerTwoWins) {
    // const { users } = state;
    // const { playerOneId, playerTwoId } = game;

    // const playerOne = users.find(user => user.id === playerOneId)
    // const playerTwo = users.find(user => user.id === playerTwoId)

    // // TODO refactor
    const playerOneTotalWinsStr = ('00' + playerOneWins.toString()).slice(-2);
    const playerTwoTotalWinsStr = ('00' + playerTwoWins.toString()).slice(-2);
    
    $("#home-wins").text(playerOneTotalWinsStr);
    $("#guest-wins").text(playerTwoTotalWinsStr);
}

// Updates the scrolling marquee under the scoreboard
function updateMarquee() {
    dbGames.limitToLast(1).on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const game = childSnapshot.val();

            $('marquee').text(`
            ${game.playerOneTeam.toUpperCase()} VS ${game.playerTwoTeam.toUpperCase()}
            : ${game.playerOneScore} - ${game.playerTwoScore}
            `);
    });
})}