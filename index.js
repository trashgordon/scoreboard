
// App state
const state = {
    game: {},
    users: [
        {
            id: 'monroeId',
            name: 'Monroe',
            totalWins: 0,
        },
        {
            id: 'cincoId',
            name: 'Cinco',
            totalWins: 0,
        }
    ],
    games: [
        {
            playerOneId: 'monroeId',
            playerTwoId: 'cincoId',
            playerOneTeam: 'ATL',
            playerTwoTeam: 'HOU',
            playerOneScore: 55,
            playerTwoScore: 56,
        },
        {
            playerOneId: 'monroeId',
            playerTwoId: 'cincoId',
            playerOneTeam: 'LAL',
            playerTwoTeam: 'MIN',
            playerOneScore: 65,
            playerTwoScore: 64,
        },
        {
            playerOneId: 'monroeId',
            playerTwoId: 'cincoId',
            playerOneTeam: 'NYK',
            playerTwoTeam: 'BKN',
            playerOneScore: 75,
            playerTwoScore: 74,
        },
    ]
};

// TODO on document load, get games from database, put in state, remove mock data
// API call that loads data
// iterate through the games and calculate totalWins for each user
// games.reduce((acc, cur) => {
//     // sum up all the wins - maybe use getWinner function
// }, { playerOneWins: 0, playerTwoWins: 0 })

// Game factory creates game
const createGame = () => ({
    playerOneId: 'monroeId',
    playerTwoId: 'cincoId',
    playerOneTeam: $('#monroe-team').val(),
    playerTwoTeam: $('#cinco-team').val(),
    playerOneScore: $('#monroe-score').val(),
    playerTwoScore: $('#cinco-score').val(),
});

// Show and hide game entry form
function showForm() {
    document.getElementById('add-game-form').style.display = 'block';
}
function hideForm() {
    document.getElementById('add-game-form').style.display = 'none';
}

// Submit game entry form
$('a#submit').on('click', () => {
    const game = createGame();

    hideForm();
    updateWins(game);
    displayWins(game);
    updateMarquee(game);
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
function updateWins(game) {
    const winnerId = getWinnerId(game);
    const winner = state.users.find(user => user.id === winnerId)

    winner.totalWins++
}

// Shows the wins on the scoreboard
function displayWins(game) {
    const { users } = state;
    const { playerOneId, playerTwoId } = game;

    const playerOne = users.find(user => user.id === playerOneId)
    const playerTwo = users.find(user => user.id === playerTwoId)

    // TODO make player name dynamic
    // $('#player-one-name').text(playerOne.name.toUpperCase());

    // TODO refactor
    const playerOneTotalWinsStr = ('00' + playerOne.totalWins.toString()).slice(-2);
    const playerTwoTotaWinsStr = ('00' + playerTwo.totalWins.toString()).slice(-2);
    
    $("#left-score").text(playerOneTotalWinsStr);
    $("#right-score").text(playerTwoTotaWinsStr);
}

// Updates the scrolling marquee under the scoreboard
function updateMarquee(game) {
    const { playerOneScore, playerTwoScore, playerOneTeam, playerTwoTeam } = game;
    const marquee = document.querySelector("marquee");
    const text = `
        ${playerOneTeam.toUpperCase()} VS ${playerTwoTeam.toUpperCase()}
        : ${playerOneScore} - ${playerTwoScore}
    `;

    // marquee.innerHTML = playerOneTeam.toUpperCase() + " VS " +
    //                     playerTwoTeam.toUpperCase() + ": " +
    //                     playerOneScore + "-" + playerTwoScore;

    marquee.text(text);
}