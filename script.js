// ---------- Words, clues, and trivia ----------
const WORDS = [
  { word: "reveille", clue: "Texas A&M’s beloved mascot",
    fact: "Reveille is a collie and holds the honorary rank of five-star general in the Corps of Cadets." },
  { word: "howdy", clue: "How Aggies say hello",
    fact: "Greeting everyone you meet with “Howdy” is a long-standing Aggie tradition." },
  { word: "maroon", clue: "The school color, along with white",
    fact: "Texas A&M’s official colors are maroon and white." },
  { word: "aggieland", clue: "A nickname for campus and its surroundings",
    fact: "Texas A&M opened in 1876 as the first public college in Texas." },
  { word: "cadet", clue: "A member of the Corps",
    fact: "The Corps of Cadets is the largest uniformed student body outside the U.S. service academies." },
  { word: "yell", clue: "Leaders do this at midnight before home games",
    fact: "Midnight Yell Practice is led by yell leaders, not cheerleaders, the night before home football games." },
  { word: "ring", clue: "A class symbol worn with pride",
    fact: "Students become eligible for the Aggie Ring after completing 90 credit hours." },
  { word: "stadium", clue: "Kyle Field is one",
    fact: "Kyle Field seats more than 100,000 fans, making it one of the largest college football stadiums in the country." },
  { word: "twelfthman", clue: "The spirit of the student section",
    fact: "In 1922, student E. King Gill stood ready on the sideline to play, which inspired the Twelfth Man tradition." }
];
const MAX_WRONG = 6;  // matches the six body parts in the drawing

// ---------- State ----------
let game = {};        // the current round: { entry, guessed, wrong, over }
let wins = 0, losses = 0;

// ---------- Page elements ----------
const $ = (id) => document.getElementById(id);
const bodyParts = document.querySelectorAll(".part");

// ---------- Starting a round ----------
function newGame() {
  let entry;
  do { entry = WORDS[Math.floor(Math.random() * WORDS.length)]; }
  while (entry === game.entry);               // avoid the same word twice in a row

  game = { entry, guessed: new Set(), wrong: 0, over: false };

  $("clue").textContent = "Clue: " + entry.clue;
  $("status").textContent = "";
  $("status").className = "";
  $("fact").hidden = true;
  $("again").hidden = true;

  buildKeyboard();
  draw();
}

function buildKeyboard() {
  $("keys").innerHTML = "";
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    const button = document.createElement("button");
    button.textContent = letter;
    button.id = "key-" + letter;
    button.addEventListener("click", () => guess(letter));
    $("keys").appendChild(button);
  }
}

// ---------- Guessing ----------
function guess(letter) {
  if (game.over || game.guessed.has(letter)) return;
  game.guessed.add(letter);

  const isHit = game.entry.word.includes(letter);
  if (!isHit) game.wrong++;

  const key = $("key-" + letter);
  key.disabled = true;
  key.classList.add(isHit ? "hit" : "miss");

  draw();
  checkForEnd();
}

// ---------- Drawing the screen ----------
function draw() {
  const revealAll = game.over && game.wrong >= MAX_WRONG;

  $("word").innerHTML = "";
  for (const letter of game.entry.word) {
    const box = document.createElement("span");
    box.textContent = game.guessed.has(letter) || revealAll ? letter : "";
    $("word").appendChild(box);
  }

  bodyParts.forEach((part, i) => part.classList.toggle("hidden", i >= game.wrong));
  $("score").textContent = `Wins ${wins} · Losses ${losses}`;
}

// ---------- Winning and losing ----------
function checkForEnd() {
  const won = [...game.entry.word].every((letter) => game.guessed.has(letter));
  if (!won && game.wrong < MAX_WRONG) return;

  game.over = true;
  won ? wins++ : losses++;

  $("status").textContent = won ? "Gig ’em! You got it." : "The word was " + game.entry.word + ".";
  $("status").className = won ? "win" : "lose";
  $("factText").textContent = game.entry.fact;
  $("fact").hidden = false;
  $("again").hidden = false;
  document.querySelectorAll("#keys button").forEach((b) => (b.disabled = true));

  draw();
  $("again").focus();
}

// ---------- Controls ----------
$("again").addEventListener("click", newGame);

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^[a-z]$/i.test(e.key)) guess(e.key.toLowerCase());
});

newGame();