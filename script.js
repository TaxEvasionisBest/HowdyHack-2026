// 1. DATA: each entry has a word, a clue, and a fact shown after the round.
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
const MAX_WRONG = 6;   // one for each body part in the drawing

// 2. STATE: things that change while you play.
let current, guessed, wrong, over, wins = 0, losses = 0, lastIndex = -1;

// 3. Shortcuts to elements on the page.
const $ = (id) => document.getElementById(id);
const wordEl = $("word"), statusEl = $("status"), keysEl = $("keys");
const parts = document.querySelectorAll(".stage .part");

// 4. Start a new round with a random word (never the same one twice in a row).
function newGame() {
  let i;
  do { i = Math.floor(Math.random() * WORDS.length); } while (i === lastIndex);
  lastIndex = i;
  current = WORDS[i];
  guessed = new Set(); wrong = 0; over = false;

  $("clue").textContent = "Clue: " + current.clue;
  statusEl.textContent = ""; statusEl.className = "";
  $("fact").hidden = true; $("again").hidden = true;
  updateScore();

  keysEl.innerHTML = "";
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    const b = document.createElement("button");
    b.textContent = letter;
    b.dataset.key = letter;
    b.addEventListener("click", () => guess(letter));
    keysEl.appendChild(b);
  }
  render();
}

function updateScore() {
  $("score").textContent = "Wins " + wins + " · Losses " + losses;
}

// 5. Handle one guessed letter.
function guess(letter) {
  if (over || guessed.has(letter)) return;
  guessed.add(letter);
  const btn = keysEl.querySelector('[data-key="' + letter + '"]');
  btn.disabled = true;
  if (current.word.includes(letter)) btn.classList.add("hit");
  else { btn.classList.add("miss"); wrong++; }
  render();
  checkEnd();
}

// 6. Redraw the word blanks and the stick figure.
function render() {
  wordEl.innerHTML = "";
  for (const letter of current.word) {
    const box = document.createElement("span");
    const show = guessed.has(letter) || (over && wrong >= MAX_WRONG);
    box.textContent = show ? letter : "";
    wordEl.appendChild(box);
  }
  parts.forEach((part, i) => part.classList.toggle("hidden", i >= wrong));
}

// 7. Did the player win or lose? If so, show the fact.
function checkEnd() {
  const won = [...current.word].every((letter) => guessed.has(letter));
  if (!won && wrong < MAX_WRONG) return;

  over = true;
  if (won) wins++; else losses++;
  statusEl.textContent = won ? "Gig ’em! You got it." : "The word was " + current.word + ".";
  statusEl.className = won ? "win" : "lose";
  keysEl.querySelectorAll("button").forEach((b) => (b.disabled = true));
  updateScore();
  $("factText").textContent = current.fact;
  $("fact").hidden = false;
  $("again").hidden = false;
  render();
  $("again").focus();
}

$("again").addEventListener("click", newGame);

// Keyboard typing works too.
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^[a-z]$/i.test(e.key)) guess(e.key.toLowerCase());
});

newGame();