/**
 * Blackout Event Module
 * NIRD Clicker Game
 * 
 * Gère l'événement de panne de courant où le joueur doit
 * trouver le routeur dans l'obscurité pour rallumer le site.
 */

var blackoutActive = false;
let blackoutOverlay = null;
let routerElement = null;

/**
 * Démarre l'événement de panne de courant
 */
function startBlackout() {
  if (blackoutActive || quizActive) return;
  
  blackoutActive = true;
  
  // Créer l'overlay sombre
  blackoutOverlay = document.createElement("div");
  blackoutOverlay.id = "blackout-overlay";
  document.body.appendChild(blackoutOverlay);
  
  // Créer le message
  const message = document.createElement("div");
  message.className = "blackout-message";
  message.innerHTML = "⚡ PANNE DE COURANT ! ⚡<br><small>Utilise ta souris comme lampe torche et trouve le routeur !</small>";
  blackoutOverlay.appendChild(message);
  
  // Activer l'overlay avec un petit délai pour l'animation
  setTimeout(() => {
    blackoutOverlay.classList.add("active");
  }, 10);
  
  // Suivre la souris pour l'effet lampe torche
  document.addEventListener("mousemove", updateFlashlight);
  
  // Placer le routeur aléatoirement après un court délai
  setTimeout(() => {
    spawnRouter();
  }, 1000);
  
  showNotification("🔦 Panne de courant ! Trouve le routeur !");
}

/**
 * Met à jour la position de la lampe torche et la visibilité du routeur
 * @param {MouseEvent} e - Événement souris
 */
function updateFlashlight(e) {
  if (!blackoutOverlay) return;
  
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  
  blackoutOverlay.style.setProperty("--mouse-x", mouseX + "px");
  blackoutOverlay.style.setProperty("--mouse-y", mouseY + "px");
  
  // Calculer la visibilité du routeur en fonction de la distance
  if (routerElement) {
    const routerRect = routerElement.getBoundingClientRect();
    const routerX = routerRect.left + routerRect.width / 2;
    const routerY = routerRect.top + routerRect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(mouseX - routerX, 2) + Math.pow(mouseY - routerY, 2)
    );
    
    // Zone d'éclairage = 80px, visibilité progressive jusqu'à 150px
    const maxVisibleDistance = 150;
    const fullVisibleDistance = 80;
    
    let opacity = 0;
    if (distance < fullVisibleDistance) {
      opacity = 1;
    } else if (distance < maxVisibleDistance) {
      opacity = 1 - (distance - fullVisibleDistance) / (maxVisibleDistance - fullVisibleDistance);
    }
    
    routerElement.style.opacity = opacity;
    
    // Ajouter l'effet de glow quand le routeur est visible
    if (opacity > 0.5) {
      routerElement.classList.add("glowing");
    } else {
      routerElement.classList.remove("glowing");
    }
  }
}

/**
 * Place le routeur à une position aléatoire
 */
function spawnRouter() {
  if (!blackoutActive) return;
  
  routerElement = document.createElement("div");
  routerElement.className = "router-target";
  routerElement.innerHTML = '<img src="computer_icons/routeur.png" alt="Routeur" />';
  routerElement.title = "Clique pour rallumer !";
  
  // Invisible par défaut, sera révélé par la lampe torche
  routerElement.style.opacity = "0";
  
  // Position aléatoire (en évitant les bords et la zone du message en haut)
  const margin = 100;
  const topMargin = 120; // Éviter la zone du message explicatif
  const x = margin + Math.random() * (window.innerWidth - 2 * margin);
  const y = topMargin + Math.random() * (window.innerHeight - topMargin - margin);
  
  routerElement.style.left = x + "px";
  routerElement.style.top = y + "px";
  
  routerElement.addEventListener("click", endBlackout);
  
  document.body.appendChild(routerElement);
}

/**
 * Termine la panne de courant (rallume le site)
 */
function endBlackout() {
  if (!blackoutActive) return;
  
  // Animation du routeur trouvé
  if (routerElement) {
    routerElement.classList.add("found");
  }
  
  // Animation de rallumage
  if (blackoutOverlay) {
    blackoutOverlay.classList.add("restoring");
  }
  
  // Récompense pour avoir trouvé le routeur
  const reward = Math.max(500, Math.floor(state.pointsPerSecond * 20));
  state.points += reward;
  state.totalPointsEarned += reward;
  
  showNotification(`💡 Lumière rétablie ! +${formatNumber(reward)} postes bonus !`);
  
  // Nettoyer après l'animation
  setTimeout(() => {
    cleanupBlackout();
  }, 800);
  
  saveGame();
  updateUI();
}

/**
 * Nettoie les éléments de la panne
 */
function cleanupBlackout() {
  document.removeEventListener("mousemove", updateFlashlight);
  
  if (blackoutOverlay) {
    blackoutOverlay.remove();
    blackoutOverlay = null;
  }
  
  if (routerElement) {
    routerElement.remove();
    routerElement = null;
  }
  
  blackoutActive = false;
}

/**
 * Vérifie si le site est en panne (pour bloquer les autres actions)
 * @returns {boolean}
 */
function isBlackoutActive() {
  return blackoutActive;
}
