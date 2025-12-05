/**
 * Save/Load Module - Persistence System
 * NIRD Clicker Game
 */

const SAVE_KEY = "nird-clicker-save";

/**
 * Save the current game state to localStorage
 */
function saveGame() {
  const saveData = {
    points: state.points,
    totalPointsEarned: state.totalPointsEarned,
    totalClicks: state.totalClicks,
    pointsPerClick: state.pointsPerClick,
    clickMultiplier: state.clickMultiplier,
    productionMultiplier: state.productionMultiplier,
    eventsClicked: state.eventsClicked,
    nirdUnlocked: state.nirdUnlocked,
    upgrades: state.upgrades.map(u => ({ id: u.id, count: u.count })),
    challenges: state.challenges.map(c => ({ id: c.id, completed: c.completed })),
    savedAt: Date.now()
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

/**
 * Load game state from localStorage
 * @returns {boolean} True if save was loaded successfully
 */
function loadGame() {
  const saveStr = localStorage.getItem(SAVE_KEY);
  if (!saveStr) return false;
  
  try {
    const saveData = JSON.parse(saveStr);
    
    state.points = saveData.points || 0;
    state.totalPointsEarned = saveData.totalPointsEarned || 0;
    state.totalClicks = saveData.totalClicks || 0;
    state.pointsPerClick = saveData.pointsPerClick || 1;
    state.clickMultiplier = saveData.clickMultiplier || 1;
    state.productionMultiplier = saveData.productionMultiplier || 1;
    state.eventsClicked = saveData.eventsClicked || 0;
    state.nirdUnlocked = saveData.nirdUnlocked || [false, false, false, false];
    
    // Restaurer les upgrades
    if (saveData.upgrades) {
      saveData.upgrades.forEach(saved => {
        const upgrade = state.upgrades.find(u => u.id === saved.id);
        if (upgrade) {
          upgrade.count = saved.count;
        }
      });
    }
    
    // Restaurer les défis
    if (saveData.challenges) {
      saveData.challenges.forEach(saved => {
        const challenge = state.challenges.find(c => c.id === saved.id);
        if (challenge) {
          challenge.completed = saved.completed;
        }
      });
    }
    
    // Calcul du temps écoulé pour la production hors-ligne
    if (saveData.savedAt) {
      const elapsed = (Date.now() - saveData.savedAt) / 1000; // en secondes
      recalcPPS();
      if (state.pointsPerSecond > 0 && elapsed > 0) {
        const maxOfflineTime = 3600 * 8; // max 8h de production hors-ligne
        const offlineTime = Math.min(elapsed, maxOfflineTime);
        const offlineEarnings = state.pointsPerSecond * offlineTime;
        state.points += offlineEarnings;
        state.totalPointsEarned += offlineEarnings;
        
        if (offlineEarnings > 0) {
          setTimeout(() => {
            showNotification(`💤 Production hors-ligne : +${formatNumber(offlineEarnings)} postes`);
          }, 500);
        }
      }
    }
    
    return true;
  } catch (e) {
    console.error("Erreur de chargement de la sauvegarde:", e);
    return false;
  }
}

/**
 * Reset the game (delete save and reload)
 */
function resetGame() {
  if (confirm("Es-tu sûr de vouloir réinitialiser ta progression ? Cette action est irréversible.")) {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem('nird-tutorial-completed');
    location.reload();
  }
}

// Expose resetGame globally for HTML onclick
window.resetGame = resetGame;
