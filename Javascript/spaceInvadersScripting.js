// JavaScript for the GameWorks Website.
// This file contains the Space Invaders Game code for the index.html page, and functions to update the users local storage saved data.

// Below is the audo for the game, this audio will be heard when playing the game.
let audioImageNumber = 0;
function toggleAudio() {
  // Below is an array of the audio images that will be used on the index page to show the audio is on or off
  let images = ["Images/AudioOff.png", "Images/AudioOn.png"]; // An images array to hold both the mute and play game music images.
  // An if statement to change the audio image source, and play or pause the audio itself.
  if(audioImageNumber == 0){
    document.getElementById("AudioButton").src = images[1];
    document.getElementById("music").play();
    audioImageNumber = 1;
    return;
  } 
  else {
    document.getElementById("AudioButton").src = images[0];
    document.getElementById("music").pause();
    audioImageNumber = 0;
    return;
  }
}

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

// Space invaders game coding.
// Audio
let userShooting = new Audio("Audio/UserShooting.wav")
let userExploding = new Audio("Audio/UserExploding.wav")
let alienShooting = new Audio("Audio/AlienShooting.wav")
let alienExploding = new Audio("Audio/AlienExploding.wav")

// Canvas details.
let tileSize = 100;
let rows = 20;
let columns = 20;
let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let canvas;

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
let shipVelocityX = tileSize; // The ship moves one tile at a time.

// All Aliens are held within the AlienArray.
let alienArray = [];
// Aliens details.
let alienWidth = tileSize;
let alienheight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImage = new Image();
alienImage.src = "../Images/AlienDefault.png";

let alienRows = 1; // The amount of rows of aliens.
let alienColumns = 10; // The count of aliens, via the columns.
let alienCount = 0; // The amount of aliens on the canvas.
let alienVelocityX = 3; // aliens move by 1 (speed) can be increased with difficulty.

// User misslies Array.
let UserMissilesArray = [];
// User missiles details.
let userMissilesVelocityY = -30; // The missiles moving speed along the Y axis.

// Alien misslies Array.
let alienMissilesArray = [];
// Alien missile details
let alienMissilesVelocityY = 10; // The missiles moving speed along the Y axis.
let alienMissilesFireDelay = 30; // The delay between the aliens firing at the user.
let alienFireMissilesTimer = alienMissilesFireDelay;

// Game details.
let score = 0;
let wave = 1;
let killCount = 0;
let gameOver = false;

// This function is called with window.onload for the index.html page.
// This function adds event listeners to call functions if the player starts the game.
function indexGamePage() {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  canvas = board.getContext("2d");
  startGameDetailsOnCanvas();
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", clickStartButton);

  document.addEventListener("keydown", shipMovement);
  document.addEventListener("keyup", userFires);
}


// This function holds the game itself, called when the player clicks the 'start game' or 'play again' buttons which hover over the canvas.
function game() {
  if (gameOver) {
    // An if statement to check if the game is over via the gameover boolean variable.
    for (let i = 0; i < localStorage.length; i++) {
      // Get the key for the current item.
      const key = localStorage.key(i);
      if (key == "debug") {
        // Ignore the debug key in localStorage.
        // And if the scenario ever occurs where its the first user to play the game with noone signed in, run these statements.
        canvas.clearRect(0, 0, board.width, board.height);
        gameOverStatement();
        gameDetailsOnCanvas();
        signInInfoOnCanvas();
      } else {
        const item = JSON.parse(localStorage.getItem(key)); // parse the key to obtain the object.
        if (item.username === sessionStorage.UserSignedIn) {
          canvas.clearRect(0, 0, board.width, board.height);
          gameOverStatement();
          gameDetailsOnCanvas();
          leaderboardInfoOnCanvas();
          break;
        } else {
          canvas.clearRect(0, 0, board.width, board.height);
          gameOverStatement();
          gameDetailsOnCanvas();
          signInInfoOnCanvas();
        }
      }
    }
    playAgain();
    return;
  }
  if (!gameOver) {
    // This if statement checks if the game is not over, if so it recalls the game function so the player can keep playing.
    requestAnimationFrame(game);
  }
  canvas.clearRect(0, 0, board.width, board.height); // Clear the canvas on every game.

  // User ship. (draw)
  canvas.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);

  // Alien ships. (draw, move)
  let reachBorder = false;
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i]; // Alien is each index within the alien array.
    if (alien.alive) {
      // If the aliens are alive, draw them using the variables below.
      alien.x += alienVelocityX; // Move the aliens along the x axis.
      canvas.drawImage(alienImage, alien.x, alien.y, alien.width, alien.height);

      if (alien.x + alien.width >= board.width || alien.x <= 0) {
        reachBorder = true;
      }
      if (reachBorder) { // if the aliens have reached the edge of the borad.
        alienVelocityX *= -1; // Reverse the direction of the aliens.
        alien.x += alienVelocityX*2; // An attempt to adjust the aliens positions.
        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alienheight; // Move all aliens down by one row.
          if (alienArray[j].y >= ship.y) {
            gameOver = true;
            userExploding.cloneNode().play();
          }
          reachBorder = false;
        }
      }
    }
  }

  // This if statement checks if an alien can fire a missile.
  // Alien missiles fire when the timer hits 0.
  // If the aliens cant fire, decrese the timer by 1.
  if (alienFireMissilesTimer > 0) {
    alienFireMissilesTimer--;
  } else {
    // Else an alien fires and the timer is reset.
    aliensFire();
    alienShooting.cloneNode().play();
    alienFireMissilesTimer = alienMissilesFireDelay;
  }

  // Alien missiles (draw, move, check for a collision)
  for (let i = 0; i < alienMissilesArray.length; i++) {
    let aMissile = alienMissilesArray[i];
    aMissile.y += alienMissilesVelocityY;
    canvas.fillStyle = "red";
    canvas.fillRect(aMissile.x, aMissile.y, aMissile.width, aMissile.height);

    // Check collision with userss ship
    if (hasCollided(aMissile, ship)) {
      gameOver = true; 
      userExploding.cloneNode().play();
      aMissile.used = true;
    }
  }

  // Clear used or off screen alien missiles.
  while (alienMissilesArray.length > 0 && (alienMissilesArray[0].used || alienMissilesArray[0].y >= boardHeight)) {
    // .shift() removes the first element of the array. 
    // This shouldnt be a problem as missiles are expected to expire (FIFO) and are cleared after the game ends.
    alienMissilesArray.shift();
  }

  // User missiles
  for (let i = 0; i < UserMissilesArray.length; i++) {
    let uMissiles = UserMissilesArray[i];
    uMissiles.y += userMissilesVelocityY;
    canvas.fillStyle = "gold";
    canvas.fillRect(uMissiles.x, uMissiles.y, uMissiles.width, uMissiles.height);

    // missile collision with alien ships
    for (let j = 0; j < alienArray.length; j++) {
      let alien = alienArray[j];
      if (!uMissiles.used && alien.alive && hasCollided(uMissiles, alien)) {
        uMissiles.used = true;
        alien.alive = false;
        killCount += 1;
        alienCount--;
        score += 50;
        alienExploding.cloneNode().play();
      }
    }
  }

  // Clear used or off screen user missiles.
  while (UserMissilesArray.length > 0 && (UserMissilesArray[0].used || UserMissilesArray[0].y < 0)) {
    // .shift() removes the first element of the array. 
    // This shouldnt be a problem as missiles are expected to expire (FIFO) and are cleared after the game ends.
    UserMissilesArray.shift();
  }

  // Next level if statement.
  if (alienCount == 0) {
    //increase the number of aliens in columns and rows by 1
    score += alienColumns * alienRows * 100; // Add some bonus points to the users score. 
    alienColumns = Math.min(alienColumns + 1, columns - 4); // A cap on the possible columns of aliens.
    alienRows = Math.min(alienRows + 1, rows - 4); // A cap at on the possible rows of aliens.
    if (alienVelocityX > 0) {
      alienVelocityX += 1; // Increase the alien movement speed towards the right by 1
    } else {
      alienVelocityX -= 1; // Increase the alien movement speed towards the left.
    }
    alienArray = [];
    UserMissilesArray = [];
    createAliens();
    wave += 1;
  }
  gameDetailsOnCanvas(); // show the score, wave and alien kil count on the scoreboard
}

// Function to move the ship along the x axis using wither left or right arrows.
function shipMovement(e) {
  if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX;
  } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
    ship.x += shipVelocityX;
  }
}

// A function to start the game when the button is clicked.
function clickStartButton() {
  const startButton = document.getElementById("startButton");
  startButton.style.display = "none";
  gameOver = false;
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
function userFires(e) {
  // The user can use either space or arrow up to shoot.
  if (e.code == "ArrowUp" || e.code == "Space") {
    userShooting.cloneNode().play();
    // Decresase the score for each missile used. This adds some skill to the game.
    score -= 5;
    // Shoot missiles using the up arrow and or space.
    let uMissiles = {
      x: ship.x + 50,
      y: ship.y + 5,
      width: 5,
      height: shipHeight - 30,
      used: false,
    };
    UserMissilesArray.push(uMissiles);
  }
}

function aliensFire() {
  let firingAliens = alienArray.filter(alien => alien.alive);
  if (firingAliens.length > 0) {
    let shooter = firingAliens[Math.floor(Math.random() * firingAliens.length)];
    let aMissile = {
      x: shooter.x + shooter.width / 2,
      y: shooter.y + shooter.height,
      width: 5,
      height: 50,
      used: false,
    };
    alienMissilesArray.push(aMissile);
  }
}

// This function detects if there has been a collision between two parameters
function hasCollided(imageI, ImageJ) {
  // This function uses the AND operator to return true or false for the combination of these four statements.
  // These four statements return a boolean each, for whether imageI has acheived a position on imageJ.
  return (
    imageI.x < ImageJ.x + ImageJ.width &&
    imageI.x + imageI.width > ImageJ.x &&
    imageI.y < ImageJ.y + ImageJ.height &&
    imageI.y + imageI.height > ImageJ.y
  );
}

// This function updates the user that's signed in scores, stored within the local storage.
function updateUserScores() {
  let userObjectToUpdate;
  for (let i = 0; i < localStorage.length; i++) {
    // Get the key for the current item.
    const key = localStorage.key(i);
    if (key == "debug") {
      // ignore the debug key in localStorage.
    } else {
      const item = JSON.parse(localStorage.getItem(key)); // parse the key to obtain the object.
      // If the key matches the user signed in, stored in session.storage use their stored details.
      if (item.username === sessionStorage.UserSignedIn) {
        userObjectToUpdate = item;
        if (score > userObjectToUpdate.highestScore) {
          userObjectToUpdate.highestScore = score;
          userObjectToUpdate.gamesPlayed += 1;
          userObjectToUpdate.alienKillCount += killCount;
          localStorage.setItem(sessionStorage.UserSignedIn,JSON.stringify(userObjectToUpdate));
        }
        break;
      }
    }
  }
}

// This function is called when the game is over. 
// It calls some end game functions and waits on en event listener to play the game again.
function playAgain(){
  updateUserScores();
  resetGameValues();
  const startButton = document.getElementById("startButton");
  startButton.innerHTML = "Play Again";
  startButton.style.display = "initial";
  startButton.addEventListener("click", clickStartButton);
}

// This function displays the game over statement with all the details.
function gameOverStatement() {
  // The Score details (position on the canvas, font, style).
  canvas.fillStyle = "gold"; // Set text details.
  canvas.font = "1000% Astropolis Academy";
  canvas.fillText("Game Over!", 460, 800); // Print the text.
  canvas.fillStyle = "white";
  canvas.font = "600% bold Poppins";
  canvas.fillText("You achieved a score of", 540, 1000);
  canvas.fillText(score, 900, 1100);
}

// This function displays the current game details at the top of the canvas.
function gameDetailsOnCanvas() {
  // The Score details (position on the canvas, font, style).
  canvas.fillStyle = "gold";
  canvas.font = "450% bold Poppins";
  canvas.fillText("Score: ", 35, 60);
  canvas.fillText(score, 230, 60);
  canvas.fillText("Aliens eliminated: ", 650, 60);
  canvas.fillText(killCount, 1190, 60);
  canvas.fillText("Wave: ", 1700, 60);
  canvas.fillText(wave, 1900, 60);
}

// This function displays the start game details on the canvas.
function startGameDetailsOnCanvas() {
  // The Start screen details (position on the canvas, font, style).
  canvas.fillStyle = "gold";
  canvas.font = "1000% Astropolis Academy";
  canvas.fillText("Space Invaders", 210, 800);
  canvas.fillText("By GameWorks", 300, 950);
  canvas.fillStyle = "white";
  canvas.font = "600% bold Poppins";
  canvas.fillText("Click the Start Game button when ready", 200, 1300);
}

// This function prints details of the users score which may be added to the leaderboard.
function leaderboardInfoOnCanvas() {
  // The end screen leaderboard details (position on the canvas, font, style).
  canvas.fillStyle = "white";
  canvas.font = "500% bold Poppins";
  canvas.fillText("Your score if good enough will show on the leaderboard",70,1300);
}

// This function prints a sign in prompt for the user on the canvas at the end of the game.
function signInInfoOnCanvas() {
  // The end screen sign in prompt details (position on the canvas, font, style).
  canvas.fillStyle = "white";
  canvas.font = "500% bold Poppins";
  canvas.fillText("Please sign in to have your score show on the leaderboard",75,1300);
}

// This function resets the game values allowing the game to return to its original state and to be played again.
function resetGameValues(){
  score = 0;
  wave = 1;
  killCount = 0;
  alienRows = 1; 
  alienColumns = 10; 
  alienCount = 0; 
  alienVelocityX = 3;
  alienArray = [];
  UserMissilesArray = [];
  alienMissilesArray = [];
  userMissilesVelocityY = -30;
  gameOver = false;
}

// This function updates the account caption in the top right hand corner of the page.
// This function is called on every page. this helps the user know where to go to find their account information.
// This function is also a good indicator to show that a user has signed in and which user.
function updateAccountCaption() {
  let pageAccountCaption = document.getElementById("userIdCaption");
  for (let i = 0; i < localStorage.length; i++) {
    // Get the key for the current item.
    const key = localStorage.key(i);
    if (key == "debug") {
      // ignore the debug key in localStorage.
    } else {
      const item = JSON.parse(localStorage.getItem(key)); // parse the key to obtain the object.
      if (item.username === sessionStorage.UserSignedIn) {
        pageAccountCaption.innerText = sessionStorage.UserSignedIn;
        break; // Break the loop.
      }
    }
  }
}