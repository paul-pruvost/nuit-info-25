/**
 * UI Module - User Interface Updates
 * NIRD Clicker Game
 */

const pointsEl = document.getElementById("points");
const ppsEl = document.getElementById("pps");

/**
 * Update all UI elements
 */
function updateUI() {
  pointsEl.textContent = formatNumber(state.points);
  ppsEl.textContent = state.pointsPerSecond.toFixed(1);
  updateShop();
  updateChallenges();
  updateComputerArt();
  
  // Mettre à jour le module NIRD
  if (typeof NirdModule !== 'undefined') {
    NirdModule.refreshSlider();
    NirdModule.updateUI();
  }
  
  // Mettre à jour le module Trading
  if (typeof TradingModule !== 'undefined') {
    TradingModule.updateUI();
  }
  
  // Mettre à jour le module Casino
  if (typeof CasinoModule !== 'undefined') {
    CasinoModule.updateUI();
  }
}

/**
 * Initialize tab navigation
 */
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      
      // Redessiner le graphique de trading quand l'onglet devient actif
      if (tab.dataset.tab === 'trading' && typeof TradingModule !== 'undefined') {
        setTimeout(() => {
          TradingModule.resizeCanvas();
          TradingModule.drawChart();
        }, 50);
      }
    });
  });
}
