/**
 * Computer Art Module - Image Evolution
 * NIRD Clicker Game
 */

let currentComputerLevel = -1;

/**
 * Update the computer image display based on current level
 */
function updateComputerArt() {
  const level = getComputerLevel(state);
  
  // Ne mettre à jour que si le niveau a changé
  if (level === currentComputerLevel) return;
  
  currentComputerLevel = level;
  const computer = COMPUTER_LEVELS_CONFIG[level];
  
  const clickButton = document.getElementById("clickButton");
  const computerArtEl = document.getElementById("computerArt");
  
  clickButton.setAttribute("data-level", level);
  
  computerArtEl.innerHTML = `
    <img src="${computer.image}" alt="${computer.name}" class="computer-image evolving" />
    <div class="computer-label">${computer.name}</div>
  `;
  
  // Retirer la classe d'animation après qu'elle soit terminée
  const img = computerArtEl.querySelector('.computer-image');
  img.addEventListener('animationend', () => {
    img.classList.remove('evolving');
  }, { once: true });
}

/**
 * Force refresh the computer art (used after purchases)
 */
function forceComputerRefresh() {
  const newLevel = getComputerLevel(state);
  if (newLevel !== currentComputerLevel) {
    currentComputerLevel = -1; // Force refresh
    updateComputerArt();
  }
}
