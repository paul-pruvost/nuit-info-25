/**
 * Utility Functions
 * NIRD Clicker Game
 */

/**
 * Format a number for display (k, M, B suffixes)
 * @param {number} n - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + " B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + " M";
  if (n >= 1_000) return (n / 1_000).toFixed(2) + " k";
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(1);
}

/**
 * Compute the cost of an upgrade based on base cost and current count
 * @param {number} baseCost - Base cost of the upgrade
 * @param {number} count - Current count owned
 * @returns {number} Computed cost
 */
function computeCost(baseCost, count) {
  const factor = Math.pow(1.15, count);
  return Math.round(baseCost * factor);
}

/**
 * Recalculate points per second based on upgrades and multipliers
 */
function recalcPPS() {
  let total = 0;
  for (const u of state.upgrades) {
    total += u.cps * u.count;
  }
  state.basePointsPerSecond = total; // PPS sans multiplicateur
  state.pointsPerSecond = total * state.productionMultiplier;
}

/**
 * Get the current click value with multipliers
 * @returns {number} Points earned per click
 */
function getClickValue() {
  return state.pointsPerClick * state.clickMultiplier;
}

/**
 * Show a notification toast
 * @param {string} message - Message to display
 */
function showNotification(message) {
  // Créer le conteneur s'il n'existe pas
  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);
  }
  
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = message;
  container.appendChild(notif);
  
  setTimeout(() => {
    notif.classList.add("show");
  }, 10);
  
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}
