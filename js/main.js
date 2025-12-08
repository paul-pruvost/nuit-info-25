/**
 * Main Entry Point
 * NIRD Clicker Game
 * 
 * This file initializes the game and sets up event listeners.
 */

// DOM Elements
const clickButton = document.getElementById("clickButton");

/**
 * Handle main button click
 */
function handleClick() {
  if (blackoutActive || bsodActive) return; // Bloqué pendant la panne ou BSOD
  
  const clickValue = getClickValue();
  state.points += clickValue;
  state.totalPointsEarned += clickValue;
  state.totalClicks += 1;
  saveGame();
  updateUI();
}

/**
 * Production tick - runs 10 times per second
 */
function productionTick() {
  if (blackoutActive || bsodActive) return; // Pas de production pendant la panne ou BSOD
  
  if (state.pointsPerSecond > 0) {
    const earned = state.pointsPerSecond / 10;
    state.points += earned;
    state.totalPointsEarned += earned;
    updateUI();
  }
  // Check for computer evolution
  updateComputerArt();
}

/**
 * Initialize the game
 */
function initGame() {
  // Load saved game
  loadGame();
  
  // Recalculate production
  recalcPPS();
  
  // Initialize UI components
  initTabs();
  initShop();
  initChallenges();
  updateComputerArt();
  updateUI();
  
  // Initialize NIRD decryption module
  NirdModule.init();
  
  // Initialize Trading module
  TradingModule.init();
  
  // Initialize Casino module
  CasinoModule.init();
  
  // Show tutorial for new players
  TutorialModule.init();
  
  // Set up click handler
  clickButton.addEventListener("click", handleClick);
  
  // Start production loop (10 ticks per second)
  setInterval(productionTick, 100);
  
  // Start auto-save (every 5 seconds)
  setInterval(saveGame, 5000);
  
  // Start random events
  scheduleNextEvent();
  
  console.log("🐧 NIRD Clicker initialized!");
}

// Start the game when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame);
} else {
  initGame();
}
