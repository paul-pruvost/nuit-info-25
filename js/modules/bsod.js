/**
 * Blue Screen Wordle Event Module
 * NIRD Clicker Game
 * 
 * Événement BSOD avec mini-jeu Wordle intégré
 */

var bsodActive = false;
let bsodOverlay = null;
let currentBsodWord = null;
let currentBsodHint = "";
let wordleGuesses = [];
let currentGuess = "";
let maxGuesses = 4;
let wordLength = 5;
let keyboardState = {};

/**
 * Démarre l'événement Blue Screen Wordle
 */
function startBsod() {
  if (bsodActive || quizActive || blackoutActive) return;
  
  bsodActive = true;
  
  // Choisir un mot aléatoire
  const wordData = BSOD_WORDS_CONFIG[Math.floor(Math.random() * BSOD_WORDS_CONFIG.length)];
  currentBsodWord = wordData.word.toUpperCase();
  currentBsodHint = wordData.hint;
  wordLength = currentBsodWord.length;
  wordleGuesses = [];
  currentGuess = "";
  keyboardState = {};
  
  // Créer l'overlay dans .app
  bsodOverlay = document.createElement("div");
  bsodOverlay.id = "bsod-overlay";
  
  // Générer le placeholder pour le mot
  const placeholder = "_ ".repeat(wordLength).trim();
  
  bsodOverlay.innerHTML = `
    <div class="bsod-content">
      <div class="bsod-sad">:(</div>
      <div class="bsod-text">${BSOD_TEXT.replace("{WORD}", `<span class="bsod-word-placeholder">${placeholder}</span>`)}</div>
      
      <div class="wordle-container">
        <div class="wordle-title">🔤 Devine le mot manquant !</div>
        <div class="wordle-hint">Indice : ${currentBsodHint}</div>
        
        <div class="wordle-grid" id="wordle-grid"></div>
        <div class="wordle-keyboard" id="wordle-keyboard"></div>
        
        <div class="wordle-result" id="wordle-result"></div>
      </div>
    </div>
  `;
  
  // Ajouter dans body pour prendre toute la fenêtre
  document.body.appendChild(bsodOverlay);
  
  // Initialiser la grille et le clavier
  initWordleGrid();
  initWordleKeyboard();
  
  // Écouter le clavier physique
  document.addEventListener("keydown", handleWordleKeydown);
  
  // Activer avec animation
  setTimeout(() => {
    bsodOverlay.classList.add("active");
  }, 10);
  
  showNotification("💀 Blue Screen ! Devine le mot pour réparer !");
}

/**
 * Initialise la grille Wordle
 */
function initWordleGrid() {
  const grid = document.getElementById("wordle-grid");
  grid.innerHTML = "";
  
  for (let i = 0; i < maxGuesses; i++) {
    const row = document.createElement("div");
    row.className = "wordle-row";
    row.id = `wordle-row-${i}`;
    
    for (let j = 0; j < wordLength; j++) {
      const cell = document.createElement("div");
      cell.className = "wordle-cell";
      cell.id = `cell-${i}-${j}`;
      row.appendChild(cell);
    }
    
    grid.appendChild(row);
  }
}

/**
 * Initialise le clavier virtuel
 */
function initWordleKeyboard() {
  const keyboard = document.getElementById("wordle-keyboard");
  const rows = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
    ["ENTER", "W", "X", "C", "V", "B", "N", "⌫"]
  ];
  
  keyboard.innerHTML = "";
  
  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    
    row.forEach(key => {
      const button = document.createElement("button");
      button.className = "key";
      button.textContent = key;
      button.id = `key-${key}`;
      
      if (key === "ENTER" || key === "⌫") {
        button.classList.add("wide");
      }
      
      button.addEventListener("click", () => handleWordleInput(key));
      rowDiv.appendChild(button);
    });
    
    keyboard.appendChild(rowDiv);
  });
}

/**
 * Gère l'entrée clavier physique
 */
function handleWordleKeydown(e) {
  if (!bsodActive) return;
  
  const key = e.key.toUpperCase();
  
  if (key === "ENTER") {
    handleWordleInput("ENTER");
  } else if (key === "BACKSPACE") {
    handleWordleInput("⌫");
  } else if (/^[A-Z]$/.test(key)) {
    handleWordleInput(key);
  }
}

/**
 * Gère l'entrée d'une touche
 */
function handleWordleInput(key) {
  if (wordleGuesses.length >= maxGuesses) return;
  
  if (key === "ENTER") {
    if (currentGuess.length === wordLength) {
      submitGuess();
    }
  } else if (key === "⌫") {
    currentGuess = currentGuess.slice(0, -1);
    updateCurrentRow();
  } else if (currentGuess.length < wordLength) {
    currentGuess += key;
    updateCurrentRow();
  }
}

/**
 * Met à jour l'affichage de la ligne courante
 */
function updateCurrentRow() {
  const rowIndex = wordleGuesses.length;
  
  for (let i = 0; i < wordLength; i++) {
    const cell = document.getElementById(`cell-${rowIndex}-${i}`);
    cell.textContent = currentGuess[i] || "";
    cell.classList.toggle("filled", currentGuess[i] !== undefined);
  }
}

/**
 * Soumet une tentative
 */
function submitGuess() {
  const guess = currentGuess.toUpperCase();
  const result = checkGuess(guess);
  
  wordleGuesses.push({ guess, result });
  
  // Animer les cellules
  const rowIndex = wordleGuesses.length - 1;
  
  for (let i = 0; i < wordLength; i++) {
    const cell = document.getElementById(`cell-${rowIndex}-${i}`);
    const status = result[i];
    
    setTimeout(() => {
      cell.classList.add(status);
      
      // Mettre à jour le clavier
      const keyBtn = document.getElementById(`key-${guess[i]}`);
      if (keyBtn) {
        if (status === "correct") {
          keyBtn.className = "key correct";
        } else if (status === "present" && !keyBtn.classList.contains("correct")) {
          keyBtn.className = "key present";
        } else if (status === "absent" && !keyBtn.classList.contains("correct") && !keyBtn.classList.contains("present")) {
          keyBtn.className = "key absent";
        }
      }
    }, i * 100);
  }
  
  // Vérifier victoire/défaite
  setTimeout(() => {
    if (guess === currentBsodWord) {
      showWordleResult(true);
    } else if (wordleGuesses.length >= maxGuesses) {
      showWordleResult(false);
    } else {
      currentGuess = "";
    }
  }, wordLength * 100 + 200);
}

/**
 * Vérifie une tentative et retourne le résultat
 */
function checkGuess(guess) {
  const result = [];
  const wordArray = currentBsodWord.split("");
  const guessArray = guess.split("");
  const used = new Array(wordLength).fill(false);
  
  // D'abord, marquer les lettres correctes
  for (let i = 0; i < wordLength; i++) {
    if (guessArray[i] === wordArray[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }
  
  // Ensuite, marquer les lettres présentes
  for (let i = 0; i < wordLength; i++) {
    if (result[i]) continue;
    
    const foundIndex = wordArray.findIndex((letter, j) => letter === guessArray[i] && !used[j]);
    if (foundIndex !== -1) {
      result[i] = "present";
      used[foundIndex] = true;
    } else {
      result[i] = "absent";
    }
  }
  
  return result;
}

/**
 * Affiche le résultat
 */
function showWordleResult(win) {
  const resultEl = document.getElementById("wordle-result");
  
  if (win) {
    const reward = Math.max(300, Math.floor(state.pointsPerSecond * 15));
    state.points += reward;
    state.totalPointsEarned += reward;
    
    resultEl.innerHTML = `🎉 Bravo ! Le mot était <strong>${currentBsodWord}</strong><br>+${formatNumber(reward)} postes !`;
    resultEl.className = "wordle-result show win";
  } else {
    resultEl.innerHTML = `😢 Perdu ! Le mot était <strong>${currentBsodWord}</strong>`;
    resultEl.className = "wordle-result show lose";
  }
  
  // Mettre à jour le placeholder
  const placeholder = document.querySelector(".bsod-word-placeholder");
  if (placeholder) {
    placeholder.textContent = currentBsodWord;
    placeholder.style.background = win ? "rgba(83, 141, 78, 0.5)" : "rgba(255, 0, 0, 0.3)";
  }
  
  saveGame();
  updateUI();
  
  // Fermer automatiquement après 2 secondes
  setTimeout(() => {
    endBsod();
  }, 2000);
}

/**
 * Termine l'événement BSOD
 */
function endBsod() {
  if (!bsodActive) return;
  
  document.removeEventListener("keydown", handleWordleKeydown);
  
  if (bsodOverlay) {
    bsodOverlay.classList.remove("active");
    setTimeout(() => {
      bsodOverlay.remove();
      bsodOverlay = null;
    }, 300);
  }
  
  bsodActive = false;
  currentBsodWord = null;
  
  showNotification("💻 Système réparé !");
}

/**
 * Vérifie si le BSOD est actif
 */
function isBsodActive() {
  return bsodActive;
}
