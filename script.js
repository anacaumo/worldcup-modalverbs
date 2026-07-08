let firstRound = true;

let answered = false;

let totalRounds = 0;

let currentRound = 1;

let feedbackRevealed = false;

let pendingFeedback = "";

let rankingActive = false;

/* ========= TEAMS ========= */

let teams = [];
let currentTeamIndex = 0;

/* ========= SETUP ========= */

function generateNameInputs() {
  let count = parseInt(document.getElementById("teamCount").value);
  let container = document.getElementById("teamNames");

  // Save existing names
  let existingNames = [];
  let inputs = container.querySelectorAll("input");

  inputs.forEach(input => {
    existingNames.push(input.value);
  });

  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Team " + (i + 1);
    input.id = "teamName" + i;

    // Restore previous values
    if (existingNames[i]) {
      input.value = existingNames[i];
    }

    // Character limit
    input.maxLength = 12;

    input.className = "team-input";

    container.appendChild(input);
  }
}

function startGame() {
  let count = parseInt(document.getElementById("teamCount").value);

  teams = [];

  for (let i = 0; i < count; i++) {
    let input = document.getElementById("teamName" + i);

    // 🛡️ safety check
    if (!input) {
      alert("Something went wrong. Try selecting the number of teams again.");
      return;
    }

    let nameInput = input.value;
    let teamName = nameInput.trim() !== "" ? nameInput : "Team " + (i + 1);

    teams.push({
      name: teamName,
      score: 0
    });

    totalRounds = parseInt(document.getElementById("roundCount").value);
currentRound = 1;
    
  }

  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";

  updateScoreboard();

  // reset rotation properly
  currentTeamIndex = 0;
  firstRound = true;

  nextRound();
}
/* ========= QUESTIONS ========= */

let allQuestions = [
  {
  text: "What does MUST usually express?",
  options: [
   
    {
      text: "Advice",
      score: 0,
      type: "Wrong",
      explanation: "Advice is usually expressed with SHOULD."
    },

     {
      text: "Strong obligation",
      score: 1,
      type: "Correct",
      explanation: "Exactly! MUST is used to express a strong obligation or rule."
    },
    
    {
      text: "Ability",
      score: 0,
      type: "Wrong",
      explanation: "Ability is usually expressed with CAN."
    },
    {
      text: "Possibility",
      score: 0,
      type: "Wrong",
      explanation: "Possibility is usually expressed with MAY or MIGHT."
    }
  ]
},

  {
  text: "Which sentence expresses possibility?",
  options: [
    {
      text: "You might need an umbrella.",
      score: 1,
      type: "Correct",
      explanation: "Correct! MIGHT expresses a possible situation that is not certain."
    },
    {
      text: "You must need an umbrella.",
      score: 0,
      type: "Wrong",
      explanation: "MUST does not express possibility here."
    },
    {
      text: "You should need an umbrella.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD is not used this way."
    },
    {
      text: "You have to need an umbrella.",
      score: 0,
      type: "Wrong",
      explanation: "HAVE TO is not used to express possibility."
    }
  ]
},

  {
  text: "Which sentence expresses an external obligation?",
  options: [
    {
      text: "You should wear a seat belt.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD gives advice, not an external obligation."
    },
    {
      text: "You can wear a seat belt.",
      score: 0,
      type: "Wrong",
      explanation: "CAN expresses possibility or permission."
    },
    {
      text: "You have to wear a seat belt.",
      score: 1,
      type: "Correct",
      explanation: "Exactly! The law creates the obligation, so HAVE TO is the best choice."
    },
    {
      text: "You might wear a seat belt.",
      score: 0,
      type: "Wrong",
      explanation: "MIGHT expresses possibility."
    }
  ]
},
  
{
  text: "What does HAVE TO usually express?",
  options: [
    {
      text: "External obligation",
      score: 1,
      type: "Correct",
      explanation: "Correct! HAVE TO expresses an obligation caused by a situation, rule or authority."
    },
    {
      text: "Advice",
      score: 0,
      type: "Wrong",
      explanation: "Advice is usually expressed with SHOULD."
    },
    {
      text: "Permission",
      score: 0,
      type: "Wrong",
      explanation: "Permission is usually expressed with MAY or CAN."
    },
    {
      text: "Ability",
      score: 0,
      type: "Wrong",
      explanation: "Ability is usually expressed with CAN."
    }
  ]
},

  {
  text: "Which expression means 'mal posso esperar'?",
  options: [
    {
      text: "have fun",
      score: 0,
      type: "Wrong",
      explanation: "'Have fun' means 'divirta-se'."
    },
    {
      text: "can't wait",
      score: 1,
      type: "Correct",
      explanation: "Correct! 'Can't wait' means 'mal posso esperar'."
    },
    {
      text: "be careful",
      score: 0,
      type: "Wrong",
      explanation: "'Be careful' means 'tenha cuidado'."
    },
    {
      text: "ask for help",
      score: 0,
      type: "Wrong",
      explanation: "'Ask for help' means 'pedir ajuda'."
    }
  ]
},

  {
  text: "Which sentence expresses a strong obligation?",
  options: [
    {
      text: "You must keep your phone close.",
      score: 1,
      type: "Correct",
      explanation: "Correct! MUST expresses a strong obligation."
    },
    {
      text: "You should keep your phone close.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD expresses advice."
    },
    {
      text: "You may keep your phone close.",
      score: 0,
      type: "Wrong",
      explanation: "MAY expresses permission or possibility."
    },
    {
      text: "You can keep your phone close.",
      score: 0,
      type: "Wrong",
      explanation: "CAN expresses ability or possibility."
    }
  ]
},
  
{
  text: "What does SHOULD usually express?",
  options: [
     {
      text: "Permission",
      score: 0,
      type: "Wrong",
      explanation: "Permission is usually expressed with MAY."
    },
  
    {
      text: "Strong obligation",
      score: 0,
      type: "Wrong",
      explanation: "Strong obligation is expressed with MUST."
    },
    {
      text: "Ability",
      score: 0,
      type: "Wrong",
      explanation: "Ability is expressed with CAN."
    },

     {
      text: "Advice",
      score: 1,
      type: "Correct",
      explanation: "Exactly! SHOULD is used to give advice or recommendations."
    }
  ]
},
  
{
  text: "What does CAN usually express?",
  options: [
    {
      text: "Strong obligation",
      score: 0,
      type: "Wrong",
      explanation: "Strong obligation is expressed with MUST."
    },
    {
      text: "Advice",
      score: 0,
      type: "Wrong",
      explanation: "Advice is expressed with SHOULD."
    },
    {
      text: "Ability or permission",
      score: 1,
      type: "Correct",
      explanation: "Correct! CAN is commonly used to express ability or possibility."
    },
    {
      text: "External obligation",
      score: 0,
      type: "Wrong",
      explanation: "External obligation is expressed with HAVE TO."
    }
  ]
},

 {
  text: "Which sentence expresses permission?",
  options: [
    {
      text: "You must take photos here.",
      score: 0,
      type: "Wrong",
      explanation: "MUST expresses obligation."
    },
    {
      text: "You should take photos here.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD gives advice."
    },
    {
      text: "You may take photos here.",
      score: 1,
      type: "Correct",
      explanation: "Exactly! MAY is used to give permission."
    },
    {
      text: "You have to take photos here.",
      score: 0,
      type: "Wrong",
      explanation: "HAVE TO expresses an obligation."
    }
  ]
},

  {
  text: "Which sentence expresses ability?",
  options: [
    {
      text: "She can speak English.",
      score: 1,
      type: "Correct",
      explanation: "Correct! CAN is used to express ability."
    },
    {
      text: "She should speak English.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD expresses advice."
    },
    {
      text: "She must speak English.",
      score: 0,
      type: "Wrong",
      explanation: "MUST expresses obligation."
    },
    {
      text: "She might speak English.",
      score: 0,
      type: "Wrong",
      explanation: "MIGHT expresses possibility."
    }
  ]
},

 {
  text: "Which sentence expresses a less certain possibility?",
  options: [
    {
      text: "It must rain tomorrow.",
      score: 0,
      type: "Wrong",
      explanation: "MUST does not express an uncertain possibility."
    },
    {
      text: "It might rain tomorrow.",
      score: 1,
      type: "Correct",
      explanation: "Exactly! MIGHT expresses a possibility that is less certain."
    },
    {
      text: "It should rain tomorrow.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD usually expresses advice or expectation."
    },
    {
      text: "It has to rain tomorrow.",
      score: 0,
      type: "Wrong",
      explanation: "HAVE TO expresses necessity, not an uncertain possibility."
    }
  ]
},
  

{
  text: "What does MAY usually express?",
  options: [
    {
      text: "Advice",
      score: 0,
      type: "Wrong",
      explanation: "Advice is expressed with SHOULD."
    },
    {
      text: "Strong obligation",
      score: 0,
      type: "Wrong",
      explanation: "Strong obligation is expressed with MUST."
    },
    {
      text: "Ability",
      score: 0,
      type: "Wrong",
      explanation: "Ability is expressed with CAN."
    },
    {
      text: "Permission or possibility",
      score: 1,
      type: "Correct",
      explanation: "Exactly! MAY is commonly used to express permission or possibility."
    }
  ]
},

 {
  text: "Which sentence expresses possibility?",
  options: [
    {
      text: "They must speak English.",
      score: 0,
      type: "Wrong",
      explanation: "MUST expresses obligation or strong certainty."
    },
    {
      text: "They should speak English.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD expresses advice."
    },
    {
      text: "They have to speak English.",
      score: 0,
      type: "Wrong",
      explanation: "HAVE TO expresses obligation."
    },
    {
      text: "They may speak English.",
      score: 1,
      type: "Correct",
      explanation: "Correct! MAY expresses possibility in this sentence."
    }
  ]
},
  {
  text: "Which sentence expresses a rule?",
  options: [
    {
      text: "Students must wear a school uniform.",
      score: 1,
      type: "Correct",
      explanation: "Exactly! MUST is often used to express rules."
    },
    {
      text: "Students should wear a school uniform.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD expresses advice, not a rule."
    },
    {
      text: "Students may wear a school uniform.",
      score: 0,
      type: "Wrong",
      explanation: "MAY expresses permission."
    },
    {
      text: "Students can wear a school uniform.",
      score: 0,
      type: "Wrong",
      explanation: "CAN expresses ability, permission or possibility."
    }
  ]
},

{
  text: "What does MIGHT usually express?",
  options: [
    {
      text: "A less certain possibility",
      score: 1,
      type: "Correct",
      explanation: "Correct! MIGHT expresses a possibility that is less certain."
    },
    {
      text: "Advice",
      score: 0,
      type: "Wrong",
      explanation: "Advice is expressed with SHOULD."
    },
    {
      text: "Strong obligation",
      score: 0,
      type: "Wrong",
      explanation: "Strong obligation is expressed with MUST."
    },
    {
      text: "Ability",
      score: 0,
      type: "Wrong",
      explanation: "Ability is expressed with CAN."
    }
  ]
},

{
  text: "Which sentence expresses permission?",
  options: [
    {
      text: "You must enter the museum.",
      score: 0,
      type: "Wrong",
      explanation: "MUST expresses obligation."
    },
    {
      text: "You should enter the museum.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD expresses advice."
    },
    {
      text: "You may enter the museum.",
      score: 1,
      type: "Correct",
      explanation: "Exactly! MAY is commonly used to give permission."
    },
    {
      text: "You have to enter the museum.",
      score: 0,
      type: "Wrong",
      explanation: "HAVE TO expresses obligation."
    }
  ]
},

{
  text: "Which sentence expresses ability?",
  options: [
    {
      text: "My friend should swim.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD expresses advice."
    },
    {
      text: "My friend must swim.",
      score: 0,
      type: "Wrong",
      explanation: "MUST expresses obligation."
    },
    {
      text: "My friend may swim.",
      score: 0,
      type: "Wrong",
      explanation: "MAY expresses permission or possibility."
    },
    {
      text: "My friend can swim.",
      score: 1,
      type: "Correct",
      explanation: "Correct! CAN expresses ability."
    }
  ]
},

  {
  text: "Which sentence expresses an external obligation?",
  options: [
    {
      text: "Passengers have to show their tickets.",
      score: 1,
      type: "Correct",
      explanation: "Correct! HAVE TO expresses an obligation created by a rule or situation."
    },
    {
      text: "Passengers should show their tickets.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD expresses advice."
    },
    {
      text: "Passengers can show their tickets.",
      score: 0,
      type: "Wrong",
      explanation: "CAN expresses ability or permission."
    },
    {
      text: "Passengers might show their tickets.",
      score: 0,
      type: "Wrong",
      explanation: "MIGHT expresses possibility."
    }
  ]
},

  {
  text: "Which sentence expresses possibility?",
  options: [
    {
      text: "It must rain this afternoon.",
      score: 0,
      type: "Wrong",
      explanation: "MUST does not express possibility in this sentence."
    },
    {
      text: "It may rain this afternoon.",
      score: 1,
      type: "Correct",
      explanation: "Exactly! MAY expresses possibility."
    },
    {
      text: "It should rain this afternoon.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD expresses advice or expectation."
    },
    {
      text: "It has to rain this afternoon.",
      score: 0,
      type: "Wrong",
      explanation: "HAVE TO expresses necessity."
    }
  ]
},

  {
  text: "Which sentence expresses a less certain possibility?",
  options: [
    {
      text: "She must be late.",
      score: 0,
      type: "Wrong",
      explanation: "MUST does not express an uncertain possibility."
    },
    {
      text: "She should be late.",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD is not used to express an uncertain possibility."
    },
    {
      text: "She might be late.",
      score: 1,
      type: "Correct",
      explanation: "Correct! MIGHT expresses a possibility that is not certain."
    },
    {
      text: "She has to be late.",
      score: 0,
      type: "Wrong",
      explanation: "HAVE TO expresses necessity."
    }
  ]
},
{
  text: "Fans _____ travel to another country to enjoy the World Cup. They can watch it on TV.",
  options: [
    {
      text: "mustn't",
      score: 0,
      type: "Wrong",
      explanation: "MUSTN'T indica proibição. Viajar não é proibido."
    },
    {
      text: "don't have to",
      score: 1,
      type: "Correct",
      explanation: "Exactly! DON'T HAVE TO significa que algo não é necessário."
    },
    {
      text: "should",
      score: 0,
      type: "Wrong",
      explanation: "SHOULD é usado para conselhos. A frase fala sobre necessidade."
    },
    {
      text: "have to",
      score: 0,
      type: "Wrong",
      explanation: "HAVE TO indicaria obrigação. Os torcedores podem assistir pela TV."
    }
  ]
}

];


/* ========= GAME ========= */

let remainingQuestions = allQuestions.slice();
let currentQuestion = null;

/* ========= HELPERS ========= */

function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


function updateScoreboard() {
  let container = document.getElementById("scoreboard");
  container.innerHTML = "";

  teams.forEach((team, index) => {
    let div = document.createElement("div");
    div.className = "team-box";

    // Highlight current team
    if (index === currentTeamIndex) {
      div.classList.add("active-team");
    }

    div.innerHTML = `
      <div class="team-name">${team.name}</div>
      <div class="team-score">${team.score}</div>
    `;

    container.appendChild(div);
  });
}

/* ========= ROUND ========= */

function nextRound() {

if (currentRound > totalRounds) {
  showRankingScreen();
  return;
}

  answered = false;
  
let nextBtn = document.getElementById("nextBtn");

nextBtn.disabled = true;
nextBtn.style.opacity = "0.5";
nextBtn.style.cursor = "not-allowed";
  
  setTheme("purple");

  // ✅ correct team rotation logic
  if (!firstRound) {
    currentTeamIndex++;
    if (currentTeamIndex >= teams.length) {
      currentTeamIndex = 0;
    }
  } else {
    firstRound = false;
  }

  let index = Math.floor(Math.random() * remainingQuestions.length);
  currentQuestion = remainingQuestions[index];

  document.getElementById("situation").innerText = currentQuestion.text;

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  let shuffledOptions = shuffleArray(currentQuestion.options);

  shuffledOptions.forEach(option => {
    let btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = option.text;

    btn.onclick = function (event) {
  handleAnswer(option, event);
};

    optionsDiv.appendChild(btn);
  });




  let feedbackBox = document.getElementById("feedback");

feedbackBox.innerText = "Discuss and choose an answer.";
feedbackBox.style.color = "#666";
feedbackBox.style.cursor = "default"; 
feedbackBox.onclick = null;


  updateScoreboard(); // ✅ keeps highlight in sync


  updateRoundDisplay();
}


/* ========= ANSWER ========= */

function handleAnswer(option, event) {
  if (answered) return;

  answered = true;

  // click animation on selected option
let clickedBtn = event.target;
  clickedBtn.classList.add("selected");

clickedBtn.style.transform = "scale(0.92)";

setTimeout(() => {
  clickedBtn.style.transform = "scale(1)";
}, 120);

  clickedBtn.style.filter = "brightness(0.95)";

  

  document.querySelectorAll(".option").forEach(btn => {
    btn.disabled = true;
  });

  teams[currentTeamIndex].score += option.score;

  let feedbackText = "[" + option.type.toUpperCase() + "]\n" + option.explanation;

  // ALWAYS remove question after answering
remainingQuestions = remainingQuestions.filter(q => q !== currentQuestion);

if (option.score === 1) {
  updateScoreboard();
  setTheme("green");
  feedbackText = "✅ " + feedbackText;

} else if (option.score === 0.5) {
  updateScoreboard();
  setTheme("yellow");
  feedbackText = "🟡 " + feedbackText;

} else {
  updateScoreboard();
  setTheme("red");
  feedbackText = "❌ " + feedbackText;
}

  pendingFeedback = feedbackText;
feedbackRevealed = false;

let feedbackBox = document.getElementById("feedback");

feedbackBox.innerText = "Click here to reveal feedback.";
feedbackBox.style.color = "#666";

feedbackBox.style.cursor = "pointer";   
feedbackBox.onclick = revealFeedback;  
feedbackBox.classList.add("clickable");


  updateScoreboard();

let nextBtn = document.getElementById("nextBtn");

nextBtn.disabled = false;
nextBtn.style.opacity = "1";
nextBtn.style.cursor = "pointer";

  // track rounds AFTER a team finishes answering
if (currentTeamIndex === teams.length - 1) {
  currentRound++;
}
}

/* ========= RESTART ========= */

function restartGame() {
  setTheme("purple");

  teams.forEach(team => team.score = 0);

  remainingQuestions = allQuestions.slice();
  currentTeamIndex = 0;
  currentRound = 1;
  firstRound = true;

  // hide everything properly
  document.getElementById("game").style.display = "none";
  document.getElementById("ranking").style.display = "none";
  document.getElementById("setup").style.display = "block";

  // reset ranking UI
  document.getElementById("rankingList").innerHTML = "";

  updateScoreboard();
}
/* ========= INIT ========= */

window.onload = function () {
  generateNameInputs();
  updateRoundOptions();
};


/* ========= HOW MANY ROUNDS ========= */
function updateRoundOptions() {
  let teamCount = parseInt(document.getElementById("teamCount").value);
  let totalQuestions = allQuestions.length;

  let maxRounds = Math.floor(totalQuestions / teamCount);

  let select = document.getElementById("roundCount");
  select.innerHTML = "";

  for (let i = 1; i <= maxRounds; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.text = i + " round" + (i > 1 ? "s" : "");
    select.appendChild(option);
  }
}

/* ========= ROUND DISPLAY ========= */

function updateRoundDisplay() {
  document.getElementById("roundDisplay").innerText =
    "Round " + currentRound + " of " + totalRounds;
}

/* ========= THEME COLORS ========= */

function setTheme(color) {
  const body = document.body;
  const box = document.querySelector(".game-box");
  const dialogue = document.querySelector(".dialogue-box");
  const buttons = document.querySelectorAll(".option");
 const nextBtn = document.getElementById("nextBtn");
  const active = document.querySelector(".active-team");

  let colors = {
    purple: { border: "#8c7ae6", bg: "#f4f1ff", button: "#dcd6ff" },
    green:  { border: "#2ecc71", bg: "#eafaf1", button: "#d5f5e3" },
    yellow: { border: "#f1c40f", bg: "#fff9e6", button: "#fff3cd" },
    red:    { border: "#ff8a8a", bg: "#ffe0e0", button: "#ffd6d6" }
  };

  let c = colors[color];

  // 🌈 BACKGROUND (whole page)
  body.style.backgroundColor = c.bg;

  // 🎮 main box
  box.style.borderColor = c.border;
  box.style.boxShadow = `6px 6px 0px ${c.border}`;

  // 💬 question box
  dialogue.style.borderColor = c.border;

  // 🎯 options
  buttons.forEach(btn => {
    btn.style.backgroundColor = c.button;
    btn.style.borderColor = c.border;
  });

  // ▶️ next button
  if (nextBtn) {
    nextBtn.style.backgroundColor = c.button;
    nextBtn.style.borderColor = c.border;
  }

  // 🧑‍🤝‍🧑 active team
// 🎯 force active team styling AFTER render
setTimeout(() => {
  const active = document.querySelector(".active-team");
  if (active) {
    active.style.border = `2px solid ${c.border}`;
    active.style.backgroundColor = c.bg;
  }
}, 0);

  // 🏆 scoreboard boxes (important!)
  document.querySelectorAll(".team-box").forEach(box => {
    box.style.borderColor = "#ccc"; // reset first
  });

  if (active) {
    active.style.borderColor = c.border;
  }

  //THEME ANIMATIONS
box.classList.remove("theme-flash");
void box.offsetWidth;
box.classList.add("theme-flash");
  
}

//REVEAL FEEDBACK ON CLICK

function revealFeedback() {
  if (feedbackRevealed) return;

  let feedbackBox = document.getElementById("feedback");

  feedbackBox.innerText = pendingFeedback;
  feedbackBox.style.color = "#000";

  feedbackRevealed = true;

  feedbackBox.style.cursor = "default";
feedbackBox.onclick = null;
  feedbackBox.classList.remove("clickable");
}

//RANKING SCREEN

/* ========= RANKING SCREEN ========= */

let ranking = [];
let revealIndex = 0;

function showRankingScreen() {
  setTheme("purple");

  document.getElementById("game").style.display = "none";
  document.getElementById("ranking").style.display = "block";

  let container = document.getElementById("rankingList");
  container.innerHTML = "";

  ranking = [...teams].sort((a, b) => {
  if (b.score !== a.score) return b.score - a.score;
  return a.name.localeCompare(b.name); // tie breaker
});

  revealIndex = ranking.length - 1;

 container.innerHTML = `
  <button id="revealBtn">Click to reveal ranking</button>
`;

  // ✅ USE GLOBAL variable
  rankingActive = true;

  document.getElementById("revealBtn").onclick = function () {
  if (!rankingActive) return;

  // remove button after first click
  this.remove();

  revealNextRank();
};
}

function revealNextRank() {
  let container = document.getElementById("rankingList");

  let hint = document.querySelector(".reveal-hint");
  if (hint) hint.remove();

  if (revealIndex === 0) {
  // next reveal will be winner, so prepare button AFTER
}


 let currentScore = ranking[revealIndex].score;
  let originalRanking = [...ranking];

// get ALL teams with this score
let group = ranking.filter(t => t.score === currentScore);

// remove them from ranking so they aren't reused
ranking = ranking.filter(t => t.score !== currentScore);

// update revealIndex properly
revealIndex = ranking.length - 1;

// determine position
let higherScores = originalRanking.filter(t => t.score > currentScore).length;
let position = higherScores + 1;

// render ALL teams in group
group.forEach(team => {
  let div = document.createElement("div");
  div.className = "rank-card reveal";

  let display = "";

  if (position === 1) display = "🥇";
  else if (position === 2) display = "🥈";
  else if (position === 3) display = "🥉";
  else display = position + (position === 4 ? "th" : "th");

  if (group.length > 1) display += " (tie)";

  div.innerHTML = `
    <div class="rank-emoji">${display}</div>
    <div class="rank-name">${team.name}</div>
    <div class="rank-score">${team.score} pts</div>
  `;

  // medal styling
  if (position === 1) {
  div.classList.add("winner", "gold");
  div.style.background = "#fff7cc";
  div.style.borderColor = "#e1b700";
}
else if (position === 2) {
  div.classList.add("silver");
  div.style.background = "#f2f2f2";
  div.style.borderColor = "#aaa";
}
else if (position === 3) {
  div.classList.add("bronze");
  div.style.background = "#f8e1d4";
  div.style.borderColor = "#c97c4a";
}

  container.prepend(div);

  div.onclick = function () {
  if (!rankingActive) return;

  div.onclick = null;

  setTimeout(() => {
    revealNextRank();
  }, position === 1 ? 1200 : 700);
};

  
});

// 🎉 winner effects (only once)
if (position === 1) {
  setTimeout(() => launchConfetti(), 400);

  setTimeout(() => {
    if (!document.getElementById("playAgainBtn")) {
      let btn = document.createElement("button");
      btn.id = "playAgainBtn";
      btn.innerText = "Restart Game";
      btn.onclick = restartGame;
      btn.style.marginTop = "20px";

      container.appendChild(btn);
    }
  }, 600);
}
}

function getRankEmoji(index, total) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  if (index === 3) return "🎖️";
  if (index === 4) return "👏";
  return "⭐";
}


//CONFETTI FOR WINNER
function launchConfetti() {
  for (let i = 0; i < 40; i++) {
    let confetti = document.createElement("div");
    confetti.className = "confetti";

    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animationDuration = (Math.random() * 1 + 1) + "s";

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
  }
}
