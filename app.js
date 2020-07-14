
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
    playerOneTeam: $('#player-one-team').val(),
    playerTwoTeam: $('#player-two-team').val(),
    playerOneScore: $('#player-one-score').val(),
    playerTwoScore: $('#player-two-score').val(),
});


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
    const game = writeData();

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

    // TODO refactor
    const playerOneTotalWinsStr = ('00' + playerOne.totalWins.toString()).slice(-2);
    const playerTwoTotalWinsStr = ('00' + playerTwo.totalWins.toString()).slice(-2);
    
    $("#home-wins").text(playerOneTotalWinsStr);
    $("#guest-wins").text(playerTwoTotalWinsStr);
}

// Updates the scrolling marquee under the scoreboard
function updateMarquee(game) {
    const { playerOneScore, playerTwoScore, playerOneTeam, playerTwoTeam } = game;
    $('marquee').text(`
        ${playerOneTeam.toUpperCase()} VS ${playerTwoTeam.toUpperCase()}
        : ${playerOneScore} - ${playerTwoScore}
    `);
}