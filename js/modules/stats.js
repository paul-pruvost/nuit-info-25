/**
 * Stats Module - Statistics Modal
 * NIRD Clicker Game
 */

/**
 * Show the statistics modal
 */
function showStats() {
  const completedChallenges = state.challenges.filter(c => c.completed).length;
  const totalUpgrades = state.upgrades.reduce((sum, u) => sum + u.count, 0);
  
  const statsHtml = `
    <div class="stats-modal">
      <div class="stats-content">
        <h2>📊 Statistiques</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${formatNumber(state.totalPointsEarned)}</div>
            <div class="stat-label">Postes libérés (total)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${formatNumber(state.totalClicks)}</div>
            <div class="stat-label">Clics totaux</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${formatNumber(getClickValue())}</div>
            <div class="stat-label">Postes par clic</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${state.pointsPerSecond.toFixed(1)}</div>
            <div class="stat-label">Postes par seconde</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${totalUpgrades}</div>
            <div class="stat-label">Actions achetées</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${completedChallenges}/${state.challenges.length}</div>
            <div class="stat-label">Défis complétés</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${state.eventsClicked}</div>
            <div class="stat-label">Événements cliqués</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">x${state.clickMultiplier.toFixed(2)}</div>
            <div class="stat-label">Multiplicateur clics</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">x${state.productionMultiplier.toFixed(2)}</div>
            <div class="stat-label">Multiplicateur prod.</div>
          </div>
        </div>
        <button class="stats-close" onclick="closeStats()">Fermer</button>
      </div>
    </div>
  `;
  
  const modal = document.createElement("div");
  modal.id = "stats-modal-container";
  modal.innerHTML = statsHtml;
  document.body.appendChild(modal);
}

/**
 * Close the statistics modal
 */
function closeStats() {
  const modal = document.getElementById("stats-modal-container");
  if (modal) modal.remove();
}

// Expose functions globally for HTML onclick
window.showStats = showStats;
window.closeStats = closeStats;
