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

// Space invaders coding.

// Canvas details.
let tileSize = 50;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

// Ship details.
let shipWidth = tileSize;
let shipHeight = tileSize;
let shipX = (tileSize * columns) / 2;
let shipY = tileSize * rows - tileSize * 2;

// The ship object.
let ship = {
  x: shipX,
  y: shipY,
  width: shipWidth,
  height: shipHeight,
};

// All Aliens are held within this AlienArray.
let alienArray = [];

// Aliens details.
let alienWidth = tileSize;
let alienheight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImage;

let alienrows = 2;
let alienColumns = 14;
let alienCount = 0;

let shipImage;
let shipVelocityX = tileSize; // ship moves by one tile

// Windown onload run processes.
window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  // Draw the ship on the canvas.
  shipImage = new Image();
  shipImage.src = "../Images/SpaceShuttleOne.png";
  shipImage.onload = function () {
    context.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);
  };

  alienImage = new Image();
  alienImage.src = "../Images/AlienDefault.png";
  createAliens();

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
};

function update() {
  requestAnimationFrame(update);

  context.clearRect(0, 0, board.width, board.height);
  // Player ship.
  context.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);

  // Alien ships.
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
      context.drawImage(
        alienImage,
        alien.x,
        alien.y,
        alien.width,
        alien.height
      );
    }
  }
}

function moveShip(e) {
  if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX;
  } else if (
    e.code == "ArrowRight" &&
    ship.x + shipVelocityX + ship.width <= board.width
  ) {
    ship.x += shipVelocityX;
  }
}

function createAliens() {
  for (let column = 0; column < alienColumns; column++) {
    for (let row = 0; row < alienrows; row++) {
      let alien = {
        image: alienImage,
        x: alienX + column * alienWidth,
        y: alienY + row * alienheight,
        width: alienWidth,
        height: alienheight,
        alive: true,
      };
      alienArray.push(alien);
    }
  }
  alienCount = alienArray.length;
}




// Sign Up
function signUp() {
  // Attain the user input fields: username, password
  const signUpUsername = document.getElementById("signUpUsername").value;
  const signUpEmail = document.getElementById("signUpEmail").value;
  const signUpPassword = document.getElementById("signUpPassword").value;
  const signUpPasswordCheck = document.getElementById("signUpPasswordCheck").value;
  const signUpForename = document.getElementById("signUpForename").value;
  const signUpSurname = document.getElementById("signUpSurname").value;

  // Attain the elements by id
  let signUpPrompt = document.getElementById("signUpPrompt");
  let signUpUsernameInputbox = document.getElementById("signUpUsername");
  let signUpEmailInputbox = document.getElementById("signUpEmail");
  let signUpPasswordInputbox = document.getElementById("signUpPassword");
  let signUpPasswordCheckInputbox = document.getElementById("signUpPasswordCheck");
  let signUpForenameInputbox = document.getElementById("signUpForename");
  let signUpSurnameInputbox = document.getElementById("signUpSurname");

  // Reset the inputbox error or success outcome and the prompt
  signUpUsernameInputbox.parentElement.className = "inputBox";
  signUpEmailInputbox.parentElement.className = "inputBox";
  signUpPasswordInputbox.parentElement.className = "inputBox";
  signUpPasswordCheckInputbox.parentElement.className = "inputBox";
  signUpForenameInputbox.parentElement.className = "inputBox";
  signUpSurnameInputbox.parentElement.className = "inputBox";
  signUpPrompt.innerHTML = "";


  // Validation
  // Guard clauses checking for empty fields
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
  if (emptyfields == true){
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
    // Get the key for the current item
    const key = localStorage.key(i);
    if (key == "debug"){ // ignore the debug key in localStorage
      console.log("Ignore debug");
    } else {
      const item = JSON.parse(localStorage.getItem(key)); // parse the key to obtain the object
      if (item && item.email === signUpEmail) { // Check for an email match
        emailInUse = true;
        break; // Break the loop
      }
    }
  
  }
  // If email exists return an error to the user
  if (emailInUse) {
    signUpEmailInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerHTML = "An account with that email already exists";
    return;
  }

  // Check for a valid email address
  const validEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!validEmailRegex.test(signUpEmail)) {
    signUpEmailInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerHTML = "Please enter a valid email address";
    return;
  }

  // Check password strength against a regex 
  const validPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?<>£$€%^&*#@])[A-Za-z\d!?<>£$€%^&*#@]{8,}$/;
  if (!validPasswordRegex.test(signUpPassword)){
    signUpPasswordInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerHTML = "Password strength inadequate\n1x Uppercase\n1x Lowercase\n1x Number\n1x of !?<>£$€%^&*#@";
    return;
  }

  // check if both passwords match
  if (signUpPassword !== signUpPasswordCheck) {
    signUpPasswordCheckInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerHTML = "Passwords must match";
    return;
  }

  // A check that forename and surname are only letters and longer than 3 characters
  const validNameRegex = /^[A-Za-z]{3,}$/;
  if (!validNameRegex.test(signUpForename)) {
    signUpForenameInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerHTML = "Please enter a forename without\nspaces, numbers, special characters";
    return;
  }
  if (!validNameRegex.test(signUpSurname)) {
    signUpSurnameInputbox.parentElement.className = "inputBox error";
    signUpPrompt.innerHTML = "Please enter a surname without\nspaces, numbers, special characters";
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




// SignIn
function signIn() {

// Attain the user input fields: username, password
const signInUsername = document.getElementById("signInUsername").value;
const signInPassword = document.getElementById("signInPassword").value;

// Attain elements by id
let signInPrompt = document.getElementById("signInPrompt");
let signInUsernameInputbox = document.getElementById("signInUsername");
let signInPasswordInputbox = document.getElementById("signInPassword");


  // Validation
  // If user exists
  if (localStorage[signInUsername] !== undefined) {
    signInUsernameInputbox.parentElement.className = "inputBox success";
    const userObject = JSON.parse(localStorage[signInUsername]);
    
    // If password matches account
    if (userObject.password === signInPassword) {
      signInPasswordInputbox.parentElement.className = "inputBox success";
      signInPrompt.innerHTML = "Sign In Successful";
      console.log(userObject);
      sessionStorage.UserSignedIn = signInUsername;
    }
    // If password doen't match account
    else {
      signInPrompt.innerHTML = "Details incorrect";
      signInPasswordInputbox.parentElement.className = "inputBox error";
    }

  }
  // If user doesn't exist
  else {
    signInPrompt.innerHTML = "Details incorrect";
    signInUsernameInputbox.parentElement.className = "inputBox error";
  }
}




// Forgot details button function.                  !!needs tweaking
function forgotDetails() {
  let forgotUsername = document.getElementById("signInUsername").value;
  if ((forgotUsername = " ")) {
    window.confirm(
      "A reset password link has been sent to the Email of " +
        forgotUsername +
        "\nIf that username has an account registered to it."
    );
  } else {
    window.confirm(
      "Please enter a username registered to an account, then click Forgot Details"
    );
  }
}

// Page Load function
function pageLoadLog() {
  console.log("Page Loaded Successfully");
}
console.log("JavaScript loaded Successfully");
