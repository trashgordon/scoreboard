// ************************* //
// CONFIGURATION AND GLOBALS //
// ************************* //

// Initialize Firebase
(function(){
    const firebaseConfig = {
        apiKey: "AIzaSyDzr8epWVsQC9F61sZfzAWC25oT2mpKUGg",
        authDomain: "scoreboard-b50c9.firebaseapp.com",
        databaseURL: "https://scoreboard-b50c9.firebaseio.com",
        projectId: "scoreboard-b50c9",
        storageBucket: "scoreboard-b50c9.appspot.com",
        messagingSenderId: "223594199965",
        appId: "1:223594199965:web:4a027c82267f35bb468d74",
        measurementId: "G-R0PDBSWL5R"
    };
    firebase.initializeApp(firebaseConfig);
})()

// Database & State variables
const auth = firebase.auth(),
      db = firebase.database(),
      dbGames = db.ref('/games/'),
      dbUsers = db.ref('/users/'),
      state = [];

// ********************************* //
// FUNCTIONS FOR DATABASE READ/WRITE //
// ********************************* //

// Retrieves data of previous games from database
dbGames.on('value', function(snapshot) {
    state.length = 0;
    snapshot.forEach(function(childSnapshot) {
        state.push(childSnapshot.val());
        calcTotWins();
        calcTotPts();
        calcBlowouts();
        updateMarquee();
    });
});

// Submit button calls a write to the database
$('a#btn-submit').on('click', () => {
    writeNewGame();
    hideAddGameForm();
});

// Writes a new game to the database
function writeNewGame()  {
    dbGames.push({
        playerOneId: 'monroeId',
        playerTwoId: 'cincoId',
        playerOneTeam: $('#player-one-team').val(),
        playerTwoTeam: $('#player-two-team').val(),
        playerOneScore: $('#player-one-score').val(),
        playerTwoScore: $('#player-two-score').val(),
})}

// Writes a new user to the database
function writeNewUser(firstName, lastName, email)  {
    dbUsers.push({
        firstName: firstName,
        lastName: lastName,
        email: email,
})}

// **************************** //
// FUNCTIONS FOR AUTHENTICATION //
// **************************** //

// Clicking Add Game button checks if a user is logged in
$('#add-game-btn').on('click', () => {
    const user = auth.currentUser;

    if (user) {
        showAddGameForm();
    } else {
        showLoginForm();
    }
})

// Login event
function login() {
    const email = $('#login-email').val(),
          pass = $('#login-pw').val();

    auth.signInWithEmailAndPassword(email, 
        pass).then(function(user) {
           var user = firebase.auth().currentUser;
           hideLoginForm();
        }, function(error) {
           // Handle Errors here.
           var errorCode = error.code;
           var errorMessage = error.message;
        });
}

// Sign up event
function signUp() {
    const firstName = $('#signUp-firstName').val(),
          lastName = $('#signUp-lastName').val(),
          email = $('#signUp-email').val(),
          pass = $('#signUp-pw').val();

    auth.createUserWithEmailAndPassword(email, 
        pass).then((user) => {
           user = firebase.auth().currentUser;
           writeNewUser(firstName, lastName, email);
           hideLoginForm();
        }, (error) => {
           // Handle Errors here.
           let errorCode = error.code;
           let errorMessage = error.message;
        });
}

// Realtime listener
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
    } else  {
        console.log('not logged in');
    }
});   

// ***************************** //
// FUNCTIONS THAT CALCULATE DATA //
// ***************************** //

// Gets all scores from state
function getScores() {
    const p1Scores = state.map(({playerOneScore}) => parseInt(playerOneScore, 10)),
          p2Scores = state.map(({playerTwoScore}) => parseInt(playerTwoScore, 10));

    return [p1Scores, p2Scores];
}

// Calculates total number of wins for each user
function calcTotWins() {
    const scores = getScores(),
          p1Scores = scores[0],
          p2Scores = scores[1];

    let p1Wins = 0,
        p2Wins = 0;

    // Iterates through scores and calculates winner 
    for (let i = 0; i < p1Scores.length; i++) {
        p1Scores[i] > p2Scores[i] ? p1Wins++ : p2Wins++;
    }

    displayWins(p1Wins, p2Wins);
}

// Calculates total number of points for each user
function calcTotPts() {
    const scores = getScores(),
          p1Scores = scores[0],
          p2Scores = scores[1];

    const p1TotPts = p1Scores.reduce(function(a, b) {
        return a + b;
    }, 0);

    const p2TotPts = p2Scores.reduce(function(a, b) {
        return a + b;
    }, 0);

     displayTotPts(p1TotPts, p2TotPts);
}

// Calculates number of blowouts for each user
function calcBlowouts() {
    const scores = getScores(),
          p1Scores = scores[0],
          p2Scores = scores[1];

    let p1Blowouts = 0,
        p2Blowouts = 0;

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

// *********************************** //
// FUNCTIONS THAT DISPLAY DATA ON SITE //
// *********************************** //

// Displays teams in dropdown lists for Add Game form
(function displayTeamOptions() {
    const teams = [
        'atl', 'bkn', 'bos', 'cha', 'chi', 'cle',
        'dal', 'den', 'det', 'gsw', 'hou', 'ind',
        'lac', 'lal', 'mem', 'mia', 'mil', 'min',
        'nop', 'nyk', 'okc', 'orl', 'phi', 'phx',
        'por', 'sac', 'sas', 'tor', 'uta', 'was']

    teams.forEach((team) => {
        const teamOption = `"<option value=\"${team}\">${team}</option>'`;
        $(".choose-team").append(teamOption);
    });
})();

// Displays total wins for each player on scoreboard
function displayWins(p1TotWins, p2TotWins) {
    const p1TotWinsStr = ('00' + p1TotWins.toString()).slice(-2),
          p2TotWinsStr = ('00' + p2TotWins.toString()).slice(-2);
    
    $("#home-wins").text(p1TotWinsStr);
    $("#guest-wins").text(p2TotWinsStr);
}

// Displays total points for each player on scoreboard
function displayTotPts(p1TotPts, p2TotPts) {
    $("#p1-tot-pts").text(p1TotPts);
    $("#p2-tot-pts").text(p2TotPts);
}

// Displays total number of blowouts for each player on scoreboard
function displayBlowouts(p1Blowouts, p2Blowouts) {
    $("#p1-blowouts").text(p1Blowouts);
    $("#p2-blowouts").text(p2Blowouts);
}

// Displays teams & scores of latest game on scrolling marquee
function updateMarquee() {
    dbGames.limitToLast(1).on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const game = childSnapshot.val();

            $('marquee').text(`
            ${game.playerOneTeam} VS ${game.playerTwoTeam}
            : ${game.playerOneScore} - ${game.playerTwoScore}
            `);
    });
})}

// ************************************ //
// FUNCTIONS THAT ADD ANIMATION TO SITE //
// ************************************ //

// Show and hide game entry form
function showAddGameForm() {
    $('#add-game-form').show();
    $('#add-game-btn').hide();
}
function hideAddGameForm() {
    $('#add-game-form').hide();
    $('#add-game-btn').show();

}

// Show and hide login form
function showLoginForm() {
    $('#login-form').show();
}
function hideLoginForm() {
    $('#login-form').hide();
}

// Hover animation for the Add Game button
$("#add-game-btn").hover(function() {
    $(this).addClass("hvr-bob");
    }, function() {
        $(this).removeClass("hvr-bob");
});

// Animations for login form
$('.form').find('input, select, textarea').on('keyup blur focus', function (e) {
  
    var $this = $(this),
        label = $this.prev('label');
  
        if (e.type === 'keyup') {
              if ($this.val() === '') {
            label.removeClass('active highlight');
          } else {
            label.addClass('active highlight');
          }
      } else if (e.type === 'blur') {
          if( $this.val() === '' ) {
              label.removeClass('active highlight'); 
              } else {
              label.removeClass('highlight');   
              }   
      } else if (e.type === 'focus') {
        
        if( $this.val() === '' ) {
              label.removeClass('highlight'); 
              } 
        else if( $this.val() !== '' ) {
              label.addClass('highlight');
              }
      }
  
  });
  
  $('.tab a').on('click', function (e) {
    
    e.preventDefault();
    
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    
    target = $(this).attr('href');
  
    $('.tab-content > div').not(target).hide();
    
    $(target).fadeIn(600);
    
  });









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