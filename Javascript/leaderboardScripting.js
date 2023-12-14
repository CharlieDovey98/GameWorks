// JavaScript for the GameWorks Website.
// This file contains the leaderboard functionality for the leaderboard.html page.

// This function is for the leaderboard.html page. 
// It creates the leaderboard table and displays it in the div #leaderboardTable.
function updateLeaderboardTable() {
  let leaderboardTable = document.getElementById("LeaderboardDiv");
  let users = [];
  let leaderboardString = "<table id='leaderboardTable'><tr><th>Position</th><th>Name</th><th>Highscore</th></tr>";
 

  let userkeys = Object.keys(localStorage);

  for (let key of userkeys){
    if (key == "debug") {
      // ignore the debug key in localStorage.
    } else {
    let user = JSON.parse(localStorage[key]);
    users.push(user);
    }}
    // Sort the users array from highest to lowest.
    users.sort((a, b) => b.highestScore - a.highestScore);

    // A for loop to add each user to the leaderboard.
    // For the first three users, they get a medal or trophy instead of an index number.
    // The for loop will start at 0, stop at 10 users within the users array, and step by 1.
    for (let i = 0; i < Math.min(users.length, 10); i++) {
      if (users[i].highestScore == 0){  // If the user within the user array has a score of 0 (when they first sign up/ havent played yet) skip them.
        continue
      }
      if (i == 0){ // For the user with index 0 (highest Scoring user) add the first place trophy to their row.
        leaderboardString += `<tr> <td><img src="../Images/Winner.png" alt="Winner" class="trophy"></td> <td>${users[i].username}</td> <td>${users[i].highestScore}</td> </tr>`;
        continue;
      }
      if (i == 1){ // For the user with index 0 (2nd highest Scoring user) add the second place medal to their row.
        leaderboardString += `<tr> <td><img src="../Images/Second.png" alt="Second Place" class="secondmedal"></td> <td>${users[i].username}</td> <td>${users[i].highestScore}</td> </tr>`;
        continue;
      }
      if (i == 2){ // For the user with index 2 (3rd highest Scoring user) add the third place medal to their row.
        leaderboardString += `<tr> <td><img src="../Images/Third.png" alt="Third Place" class="thirdmedal"></td> <td>${users[i].username}</td> <td>${users[i].highestScore}</td> </tr>`;
        continue;
      }else { // Else add the users in the leaderboard by index, name, and highestScore.
        leaderboardString += `<tr> <td>${i + 1}</td> <td>${users[i].username}</td> <td>${users[i].highestScore}</td> </tr>`;
      }
  }

  leaderboardString += "</table>";
  leaderboardTable.innerHTML = leaderboardString;
}