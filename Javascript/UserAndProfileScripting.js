// JavaScript for the GameWorks Website

// Sign Up functionality with validation.
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
    // Get the key for the first item within localStorage.
    const key = localStorage.key(i);
    if (key == "debug") {
      // ignore the debug key in localStorage.
    } else {
      const user = JSON.parse(localStorage.getItem(key)); // parse the key to obtain the object.
      if (user.email === signUpEmail) {
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

  // Save the input data to Local storage after all criteria has been met.
  localStorage[signUpUsername] = JSON.stringify(userObject);
}

// SignIn functionality with validation.
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
      sessionStorage.UserSignedIn = signInUsername;
      updateAccountCaption();
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

// Forgot details button functionality with validation.
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
  let profileTableAlienKillCount = document.getElementById("pTableAlienKillCount");
  let profileTableHeading = document.getElementById("profileTableHeading");

  // A for loop to look for the the user within local storage to attain their information.
  for (let i = 0; i < localStorage.length; i++) {
    // Get the key for the current item.
    const key = localStorage.key(i);
    if (key == "debug") {
      // ignore the debug key in localStorage.
    } else {
      const item = JSON.parse(localStorage.getItem(key)); // parse the key to obtain the object.
      // If the key matches the user signed in, stored in session.storage use their stored details.
      if (item.username === sessionStorage.UserSignedIn) {
        let userObject = item;
        profileTableHeading.innerText = " ";
        profileTableEmail.innerText = item.email;
        profileTableUsername.innerText = item.username;
        profileTableForename.innerText = item.forename;
        profileTableSurname.innerText = item.surname;
        profileTableGamesPlayed.innerText = item.gamesPlayed;
        profileTableHighestScore.innerText = item.highestScore;
        profileTableAlienKillCount.innerText = item.alienKillCount;
      }
    }
  }
}

// This function signs the user out of session storage and calls the clearProfileInformation() function. 
function signOut() {
  sessionStorage.clear();
  clearProfileInformation();
}

// A function to clear the profile information page when a player decides to sign out.
function clearProfileInformation() {
  let profileTableEmail = document.getElementById("pTableEmail");
  let profileTableUsername = document.getElementById("pTableUsername");
  let profileTableForename = document.getElementById("pTableForename");
  let profileTableSurname = document.getElementById("pTableSurname");
  let profileTableGamesPlayed = document.getElementById("pTableGamesPlayed");
  let profileTableHighestScore = document.getElementById("pTableHighestScore");
  let profileTableAlienKillCount = document.getElementById("pTableAlienKillCount");
  let profileTableHeading = document.getElementById("profileTableHeading");
  let pageAccountCaption = document.getElementById("userIdCaption");
  // (above) declaring some local variables, and (below) setting them to a prompt message.
  profileTableHeading.innerText = "Sign up, then Sign in to view";
  profileTableEmail.innerText = " ";
  profileTableUsername.innerText = " ";
  profileTableForename.innerText = " ";
  profileTableSurname.innerText = " ";
  profileTableGamesPlayed.innerText = " ";
  profileTableHighestScore.innerText = " ";
  profileTableAlienKillCount.innerText = " ";
  pageAccountCaption.innerHTML = "Profile";
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