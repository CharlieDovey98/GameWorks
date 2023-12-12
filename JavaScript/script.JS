// JavaScript for the GameWorks Website

/* Below is the code for a fullscreen element,
called when the user clicks on the full screen png:
reference: https://stackoverflow.com/questions/3900701/onclick-go-full-screen */
function toggleFullScreen() {
  if (
    (document.fullScreenElement && document.fullScreenElement !== null) ||
    (!document.mozFullScreen && !document.webkitIsFullScreen)
  ) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (localStorage) {
  const savedScores = localStorage.getItem("highestScore");
  console.log(savedScores);
} else {
  console.log("localStorage is not supported");
}

// Registration and login page

// Sign Up
function signUp() {
  // Attain the user input fields: username, password.
  const signUpUsername = document.getElementById("signUpUsername").value;
  const signUpEmail = document.getElementById("signUpEmail").value;
  const signUpPassword = document.getElementById("signUpPassword").value;
  const signUpPasswordCheck = document.getElementById(
    "signUpPasswordCheck"
  ).value;
  const signUpForename = document.getElementById("signUpForename").value;
  const signUpSurname = document.getElementById("signUpSurname").value;

  // Attain the elements by id.
  let signUpPrompt = document.getElementById("signUpPrompt");
  let signUpUsernameInputbox = document.getElementById("signUpUsername");
  let signUpEmailInputbox = document.getElementById("signUpEmail");
  let signUpPasswordInputbox = document.getElementById("signUpPassword");
  let signUpPasswordCheckInputbox = document.getElementById(
    "signUpPasswordCheck"
  );
  let signUpForenameInputbox = document.getElementById("signUpForename");
  let signUpSurnameInputbox = document.getElementById("signUpSurname");

  // Reset the inputbox error or success outcome and the prompt.
  signUpUsernameInputbox.parentElement.className = "inputBox";
  signUpEmailInputbox.parentElement.className = "inputBox";
  signUpPasswordInputbox.parentElement.className = "inputBox";
  signUpPasswordCheckInputbox.parentElement.className = "inputBox";
  signUpForenameInputbox.parentElement.className = "inputBox";
  signUpSurnameInputbox.parentElement.className = "inputBox";
  signUpPrompt.innerHTML = "";

  // Validation.
  // Guard clauses checking for empty fields.
  let emptyfields = false;
  if (signUpUsername === "") {
    signUpUsernameInputbox.parentElement.className = "inputBox error";
    emptyfields = true;
  }
  if (signUpEmail === "") {
    signUpEmailInputbox.parentElement.className = "inputBox error";
    emptyfields = true;
  }
  if (signUpPassword === "") {
    signUpPasswordInputbox.parentElement.className = "inputBox error";
    emptyfields = true;
  }
  if (signUpPasswordCheck === "") {
    signUpPasswordCheckInputbox.parentElement.className = "inputBox error";
    emptyfields = true;
  }
  if (signUpForename === "") {
    signUpForenameInputbox.parentElement.className = "inputBox error";
    emptyfields = true;
  }
  if (signUpSurname === "") {
    signUpSurnameInputbox.parentElement.className = "inputBox error";
    emptyfields = true;
  }
  if (emptyfields == true) {
    signUpPrompt.innerHTML = "Fields cannot be empty";
    return;
  }

  // If username already exist
  if (localStorage[signUpUsername] !== undefined) {
    signUpUsernameInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerHTML = "A user with that ID already exists";
    return;
  }

  let emailInUse = false;
  for (let i = 0; i < localStorage.length; i++) {
    // Get the key for the current item.
    const key = localStorage.key(i);
    if (key == "debug") {
      // ignore the debug key in localStorage.
      console.log("Ignored debug, localStorage non-user object");
    } else {
      const item = JSON.parse(localStorage.getItem(key)); // parse the key to obtain the object.
      if (item && item.email === signUpEmail) {
        // Check for an email match.
        emailInUse = true;
        break; // Break the loop.
      }
    }
  }
  // If email exists return an error to the user.
  if (emailInUse) {
    signUpEmailInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerHTML = "An account with that email already exists";
    return;
  }

  // Check for a valid email address.
  const validEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!validEmailRegex.test(signUpEmail)) {
    signUpEmailInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerHTML = "Please enter a valid email address";
    return;
  }

  // Check password strength against a regex.
  const validPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?<>£$€%^&*#@])[A-Za-z\d!?<>£$€%^&*#@]{8,}$/;
  if (!validPasswordRegex.test(signUpPassword)) {
    signUpPasswordInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerText ="Password strength inadequate!\nYou need to include a minimum of\n1 x Uppercase letter\n1 x Lowercase letter\n1 x Number\n1 x Special character\n( ! ? < > £ $ € % ^ & @ * # )";
    return;
  }

  // Check if both passwords match.
  if (signUpPassword !== signUpPasswordCheck) {
    signUpPasswordCheckInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerHTML = "Passwords must match";
    return;
  }

  // A check that forename and surname are only letters and longer than 3 characters.
  const validNameRegex = /^[A-Za-z]{3,}$/;
  if (!validNameRegex.test(signUpForename)) {
    signUpForenameInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerText =
      "Please enter a forename without\nspaces, numbers, special characters";
    return;
  }
  if (!validNameRegex.test(signUpSurname)) {
    signUpSurnameInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerText =
      "Please enter a surname without\nspaces, numbers, special characters";
    return;
  }

  // the user Object to store all their details and information.
  const userObject = {
    username: signUpUsername,
    password: signUpPassword,
    email: signUpEmail.toLowerCase(),
    forename: signUpForename,
    surname: signUpSurname,
    highestScore: 0,
    gamesPlayed: 0,
    alienKillCount: 0,
  };

  signUpUsernameInputbox.parentElement.className = "inputBox success";
  signUpEmailInputbox.parentElement.className = "inputBox success";
  signUpPasswordInputbox.parentElement.className = "inputBox success";
  signUpPasswordCheckInputbox.parentElement.className = "inputBox success";
  signUpForenameInputbox.parentElement.className = "inputBox success";
  signUpSurnameInputbox.parentElement.className = "inputBox success";
  signUpPrompt.innerHTML = "Sign Up successful";
  console.log(userObject);

  // Save the input data to Local storage after all criteria has been met.
  localStorage[signUpUsername] = JSON.stringify(userObject);
}

// SignIn.
function signIn() {
  // Attain the user input fields: username, password.
  const signInUsername = document.getElementById("signInUsername").value;
  const signInPassword = document.getElementById("signInPassword").value;

  // Attain elements by id.
  let signInPrompt = document.getElementById("signInPrompt");
  let signInUsernameInputbox = document.getElementById("signInUsername");
  let signInPasswordInputbox = document.getElementById("signInPassword");

  // Validation.
  // If user exists.
  if (localStorage[signInUsername] !== undefined) {
    signInUsernameInputbox.parentElement.className = "inputBox success";
    const userObject = JSON.parse(localStorage[signInUsername]);

    // If password matches account.
    if (userObject.password === signInPassword) {
      signInPasswordInputbox.parentElement.className = "inputBox success";
      signInPrompt.innerHTML = "Sign In Successful";
      console.log("UserObject",userObject);
      console.log("JSON User",JSON.stringify(userObject));
      console.log("User:",userObject.username, "Signed in.");
      sessionStorage.UserSignedIn = signInUsername;
    }
    // If password doen't match account.
    else {
      signInPrompt.innerHTML = "Details incorrect";
      signInPasswordInputbox.parentElement.className = "inputBox error";
    }
  }
  // If user doesn't exist.
  else {
    signInPrompt.innerHTML = "Details incorrect";
    signInUsernameInputbox.parentElement.className = "inputBox error";
  }
}

// Forgot details button function.
function forgotDetails() {
  // Attain the user input field username.
  const signInUsername = document.getElementById("signInUsername").value;
  // Attain elements by id.
  let signInPrompt = document.getElementById("signInPrompt");
  let signInUsernameInputbox = document.getElementById("signInUsername");

  // Validation.
  // Guard clause checking for an empty field in the username input box.
  let emptyfields = false;
  if (signInUsername === "") {
    signInUsernameInputbox.parentElement.className = "inputBox error";
    emptyfields = true;
  }
  if (emptyfields == true) {
    signInPrompt.innerHTML = "Please enter your username";
    return;
  }
  // If user exists.
  if (localStorage[signInUsername] !== undefined) {
    signInUsernameInputbox.parentElement.className = "inputBox success";
    signInPrompt.innerText = "A Password reset link has been sent\nto the users email address";
  }
  else { // Else the user has to enter a correct username to recieve the forgot password link.
      signInPrompt.innerHTML = "That username is not registered";
      signInPasswordInputbox.parentElement.className = "inputBox error";
  }
}

// This function updates the profile page with the users information.
function updateProfilePage() {
  let profileTableEmail = document.getElementById("pTableEmail");
  let profileTableUsername = document.getElementById("pTableUsername");
  let profileTableForename = document.getElementById("pTableForename");
  let profileTableSurname = document.getElementById("pTableSurname");
  let profileTableGamesPlayed = document.getElementById("pTableGamesPlayed");
  let profileTableHighestScore = document.getElementById("pTableHighestScore");
  let profileTableAlienKillCount = document.getElementById(
    "pTableAlienKillCount"
  );
  let profileTableHeading = document.getElementById("profileTableHeading");

  // A for loop to look for the the user within local storage to attain their information.
  for (let i = 0; i < localStorage.length; i++) {
    // Get the key for the current item.
    const key = localStorage.key(i);
    if (key == "debug") {
      // ignore the debug key in localStorage.
      console.log("Ignored debug, localStorage non-user object");
    } else {
      const item = JSON.parse(localStorage.getItem(key)); // parse the key to obtain the object.
      // If the key matches the user signed in, stored in session.storage use their stored details.
      if (item.username === sessionStorage.UserSignedIn) {
        let userObject = item;
        console.log("the user is signed in as: ", sessionStorage.UserSignedIn);
        profileTableHeading.innerText = " ";
        profileTableEmail.innerText = item.email;
        profileTableUsername.innerText = item.username;
        profileTableForename.innerText = item.forename;
        profileTableSurname.innerText = item.surname;
        profileTableGamesPlayed.innerText = item.gamesPlayed;
        profileTableHighestScore.innerText = item.highestScore;
        profileTableAlienKillCount.innerText = "Sign In Successful";
      }
    }
  }
}

function updateAccountCaption() {
  //dgdgdfgdfgdfgdfgdfgdfg
  //
  //
  //
}

function signOut() {
  sessionStorage.clear();
  clearProfileInformation();
  console.log("User has signed out")
}

// A function to clear the profile information page when a player decides to sign out.
function clearProfileInformation() {
  let profileTableEmail = document.getElementById("pTableEmail");
  let profileTableUsername = document.getElementById("pTableUsername");
  let profileTableForename = document.getElementById("pTableForename");
  let profileTableSurname = document.getElementById("pTableSurname");
  let profileTableGamesPlayed = document.getElementById("pTableGamesPlayed");
  let profileTableHighestScore = document.getElementById("pTableHighestScore");
  let profileTableAlienKillCount = document.getElementById(
    "pTableAlienKillCount"
  );
  let profileTableHeading = document.getElementById("profileTableHeading");
  // (above) declaring some local variables, and (below) setting them to a prompt message.
  profileTableHeading.innerText = "Sign up, then Sign in to view";
  profileTableEmail.innerText = " ";
  profileTableUsername.innerText = " ";
  profileTableForename.innerText = " ";
  profileTableSurname.innerText = " ";
  profileTableGamesPlayed.innerText = " ";
  profileTableHighestScore.innerText = " ";
  profileTableAlienKillCount.innerText = " ";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Space invaders game coding.

// Canvas details.
let tileSize = 100;
let rows = 20;
let columns = 20;
let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

// Ship details.
let shipWidth = tileSize;
let shipHeight = tileSize;
let shipX = (tileSize * columns) / 2;
let shipY = tileSize * rows - tileSize * 2;

// The ship object. (X,Y,Height,Width)
let ship = {
  x: shipX,
  y: shipY,
  width: shipWidth,
  height: shipHeight,
};
let shipImage = new Image();
shipImage.src = "../Images/SpaceShuttleOne.png";
let shipVelocityX = tileSize; // The ship moves one tile at a time

// All Aliens are held within the AlienArray.
let alienArray = [];
// Aliens details.
let alienWidth = tileSize;
let alienheight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImage = new Image();
alienImage.src = "../Images/AlienDefault.png";

let alienRows = 1; // The amount of rows of aliens
let alienColumns = 10; // The count of aliens, via the columns
let alienCount = 0; // The amount of aliens on the canvas
let alienVelocityX = 3; // aliens move by 1 (speed) can be increased with difficulty.

// Misslies Array.
let missilesArray = [];
// Missiles details.
let missilesVelocityY = -30; // The missiles moving speed along the Y axis.

let score = 0;
let wave = 1;
let killCount = 0;
let gameOver = false;

function indexGamePage() {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");
  startGameDetailsOnCanvas();
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", clickStartButton);

  document.addEventListener("keydown", shipMovement);
  document.addEventListener("keyup", fire);
}

function game() {
  requestAnimationFrame(game);
  if (gameOver) {
    gameOverStatement();
    gameDetailsOnCanvas();
    for (let i = 0; i < localStorage.length; i++) {
      // Get the key for the current item.
      const key = localStorage.key(i);
      if (key == "debug") {
        // ignore the debug key in localStorage.
        console.log("Ignored debug, localStorage non-user object");
      } else {
        const item = JSON.parse(localStorage.getItem(key)); // parse the key to obtain the object.
        if (item.username === sessionStorage.UserSignedIn) {
          leaderboardInfoOnCanvas();
          break; // Break the loop.
        }
        else {
          signInInfoOnCanvas(); // 
          break; // Break the loop.
        }
      }
    }
    updateUserScores();
    const startButton = document.getElementById("startButton");
    startButton.innerText = 
    startButton.style.display = "initial";
    startButton.addEventListener("click", clickStartButton);
    gameOver = false;
    return;
  }

  //updateUserScores();

  context.clearRect(0, 0, board.width, board.height); // Clear the canvas on every game.

  // Player ship. (draw)
  context.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);

  // Alien ships. (draw, move)
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i]; // Alien is each index within the alien array.
    if (alien.alive) {
      // If the aliens are alive, draw them using the variables below.

      alien.x += alienVelocityX; // Move the aliens along the x axis.

      if (alien.x + alien.width >= board.width || alien.x <= 0) {
        alienVelocityX *= -1; // If the aliens touch the side of the canvas, reverse the direction.
        alien.x += alienVelocityX * 2; // Make sure the aliens are in their tile place correctly.

        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alien.height;
        }
      }
      context.drawImage(
        alienImage,
        alien.x,
        alien.y,
        alien.width,
        alien.height
      );
      if (alien.y >= ship.y) {
        gameOver = true;
      }
    }
  }

  // Missiles
  for (let i = 0; i < missilesArray.length; i++) {
    let missiles = missilesArray[i];
    missiles.y += missilesVelocityY;
    context.fillStyle = "gold";
    context.fillRect(missiles.x, missiles.y, missiles.width, missiles.height);

    // missile collision with alien ships
    for (let j = 0; j < alienArray.length; j++) {
      let alien = alienArray[j];
      if (!missiles.used && alien.alive && detectCollision(missiles, alien)) {
        missiles.used = true;
        alien.alive = false;
        killCount += 1;
        alienCount--;
        score += 50;
        gameOver = true;
      }
    }
  }

  // Clear missiles
  while (
    missilesArray.length > 0 &&
    (missilesArray[0].used || missilesArray[0].y < 0)
  ) {
    missilesArray.shift(); //removes the first element of the array
  }
  // Next level if statement.
  if (alienCount == 0) {
    //increase the number of aliens in columns and rows by 1
    score += alienColumns * alienRows * 100; //bonus points :)
    alienColumns = Math.min(alienColumns + 1, columns - 4); // cap at 12
    alienRows = Math.min(alienRows + 1, rows - 4); //cap at 16-4 = 12
    if (alienVelocityX > 0) {
      alienVelocityX += 0.1; //increase the alien movement speed towards the right
    } else {
      alienVelocityX -= 0.1; //increase the alien movement speed towards the left.
    }
    alienArray = [];
    missilesArray = [];
    createAliens();
    wave += 1;
  }
  gameDetailsOnCanvas(); // show the score, wave and alien kil count on the scoreboard
}

// Function to move the ship along the x axis using wither lef tor right arrows.
function shipMovement(e) {
  if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX;
  } else if (
    e.code == "ArrowRight" &&
    ship.x + shipVelocityX + ship.width <= board.width
  ) {
    ship.x += shipVelocityX;
  }
}

// A function toi start the game when the button is clicked.
function clickStartButton() {
  const startButton = document.getElementById("startButton");
  startButton.style.display = "none";
  createAliens();
  game();
}

// Function to draw the aliens on the canvas.
function createAliens() {
  for (let column = 0; column < alienColumns; column++) {
    for (let row = 0; row < alienRows; row++) {
      let alien = {
        alive: true,
        image: alienImage,
        x: alienX + column * alienWidth,
        y: alienY + row * alienheight,
        width: alienWidth,
        height: alienheight,
      };
      alienArray.push(alien); // Push the aliens into the alienArray.
    }
  }
  alienCount = alienArray.length; // game the alien count on the canvas.
}

// Function to handle the firing from the ship
function fire(e) {
  if (gameOver) {
    return;
  }
  if (e.code == "ArrowUp" || e.code == "Space") {
    // The user can use either space or arrow up to fire.
    // Decresase the score for each missile used. This adds some skill to the game.
    score -= 5;
    // Fire missiles using the up arrow and or space.
    let missiles = {
      x: ship.x + 18,
      y: ship.y + 5,
      width: 5,
      height: shipHeight - 30,
      used: false,
    };
    missilesArray.push(missiles);
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}

// This function updates the user that's signed in scores, stored within the local storage.
function updateUserScores() {
  /*for (let i = 0; i < localStorage.length; i++) {
    // Get the key for the current item.
    const key = localStorage.key(i);
    if (key == "debug") {
      // ignore the debug key in localStorage.
      console.log("Ignored debug, localStorage non-user object");
    } else {
      const user = JSON.parse(localStorage.getItem(key)); // parse the key to obtain the object.

      if (user.username === sessionStorage.UserSignedIn) {
        let userAsJSObject = JSON.parse(sessionStorage.UserSignedIn);
        console.log(user);
        console.log(userAsJSObject);
        if (score > user.highestScore) {
          user.highestScore = score;
        }
        user.gamesPlayed += 1;
        break; // Break the loop.
      } else {
        break; // Break the loop.
      }
    }
  }
*/
}

// This function displays the game over statement with all the details.
function gameOverStatement() {
  // The Score details (position on the canvas, font, style).
  context.clearRect(0, 0, board.width, board.height); // Clear the canvas.
  context.fillStyle = "gold"; // Set text details.
  context.font = "1000% Astropolis Academy";
  context.fillText("Game Over!", 460, 800); // Print the text.
  context.fillStyle = "white";
  context.font = "600% bold Poppins";
  context.fillText("You achieved a score of", 540, 1000);
  context.fillText(score, 900, 1100);
}

// This function displays the current game details at the top of the canvas.
function gameDetailsOnCanvas() {
  // The Score details (position on the canvas, font, style).
  context.fillStyle = "gold";
  context.font = "450% bold Poppins";
  context.fillText("Score: ", 35, 60);
  context.fillText(score, 230, 60);
  context.fillText("Aliens eliminated: ", 650, 60);
  context.fillText(killCount, 1190, 60);
  context.fillText("Wave: ", 1700, 60);
  context.fillText(wave, 1900, 60);
}

// This function displays the start game details on the canvas.
function startGameDetailsOnCanvas() {
  // The Start screen details (position on the canvas, font, style).
  context.fillStyle = "gold";
  context.font = "1000% Astropolis Academy";
  context.fillText("Space Invaders", 210, 800);
  context.fillText("By GameWorks", 300, 950);
  context.fillStyle = "white";
  context.font = "600% bold Poppins";
  context.fillText("Click the Start Game button when ready", 200, 1300);
}

// This function prints details of the users score which may be added to the leaderboard.
function leaderboardInfoOnCanvas() {
  // The end screen leaderboard details (position on the canvas, font, style).
  context.fillStyle = "white";
  context.font = "500% bold Poppins";
  context.fillText("Your score if good enough will show on the leaderboard",70,1300);
}

// This function prints a sign in prompt for the user on the canvas at the end of the game.
function signInInfoOnCanvas() {
  // The end screen sign in prompt details (position on the canvas, font, style).
  context.fillStyle = "white";
  context.font = "500% bold Poppins";
  context.fillText("Please sign in to have your score show on the leaderboard",75,1300);
}

// Console log, Load function.
function pageLoadLog() {
  console.log("Page Loaded Successfully");
  console.log("JavaScript loaded Successfully");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Code for the loaderboard which will be displayed on a canvas on the leaderboard page.
