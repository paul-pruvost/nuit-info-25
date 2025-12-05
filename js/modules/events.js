/**
 * Random Events Module
 * NIRD Clicker Game
 */

let activeEvent = null;
let tempBoostTimeout = null;
let originalProductionMult = 1;

// Variable partagée avec le module quiz (sera redéfinie dans quiz.js)
var quizActive = false;

/**
 * Spawn a random event on the screen
 */
function spawnRandomEvent() {
  if (activeEvent) return; // Un seul événement à la fois
  if (quizActive) return; // Pas d'événement pendant un quiz
  if (blackoutActive) return; // Pas d'événement pendant une panne
  if (bsodActive) return; // Pas d'événement pendant un BSOD
  
  // 10% chance de panne de courant (seulement si on a un peu de production)
  if (state.pointsPerSecond >= 1 && Math.random() < 0.1) {
    startBlackout();
    return;
  }
  
  // 10% chance de BSOD Wordle
  if (state.pointsPerSecond >= 1 && Math.random() < 0.1) {
    startBsod();
    return;
  }
  
  // 50% chance de quiz, 50% chance d'autre événement
  let eventType;
  const quizEvent = state.eventTypes.find(e => e.isQuiz);
  const otherEvents = state.eventTypes.filter(e => !e.isQuiz);
  
  if (quizEvent && Math.random() < 0.5) {
    eventType = quizEvent;
  } else {
    eventType = otherEvents[Math.floor(Math.random() * otherEvents.length)];
  }
  
  const appEl = document.querySelector(".app");
  const appRect = appEl.getBoundingClientRect();
  
  const event = document.createElement("div");
  event.className = "random-event";
  
  // Style spécial pour le quiz (bulle orange)
  if (eventType.isQuiz) {
    event.classList.add("quiz-bubble");
  }
  
  event.innerHTML = `<span class="event-icon">${eventType.icon}</span>`;
  event.title = eventType.message;
  
  // Position aléatoire dans l'app
  const maxX = appRect.width - 60;
  const maxY = appRect.height - 60;
  const startX = Math.random() * maxX;
  const startY = Math.random() * maxY;
  
  event.style.left = startX + "px";
  event.style.top = startY + "px";
  
  // Animation de mouvement aléatoire
  const isFlying = ["flying-tux", "golden-cd", "lightning"].includes(eventType.id);
  if (isFlying) {
    event.classList.add("flying");
    animateFlyingEvent(event, appRect);
  } else if (eventType.isQuiz) {
    event.classList.add("waiting");
    // Le quiz reste un peu plus longtemps
  } else {
    event.classList.add("waiting");
  }
  
  activeEvent = {
    element: event,
    type: eventType,
    timeout: setTimeout(() => {
      removeEvent();
    }, eventType.isQuiz ? 10000 : (isFlying ? 5000 : 8000))
  };
  
  event.addEventListener("click", () => {
    clickEvent();
  });
  
  appEl.appendChild(event);
}

/**
 * Animate a flying event bouncing around
 * @param {HTMLElement} element - Event element
 * @param {DOMRect} appRect - App bounding rect
 */
function animateFlyingEvent(element, appRect) {
  let x = parseFloat(element.style.left);
  let y = parseFloat(element.style.top);
  let vx = (Math.random() - 0.5) * 8;
  let vy = (Math.random() - 0.5) * 8;
  
  const animate = () => {
    if (!activeEvent || activeEvent.element !== element) return;
    
    x += vx;
    y += vy;
    
    // Rebondir sur les bords
    if (x <= 0 || x >= appRect.width - 60) vx *= -1;
    if (y <= 0 || y >= appRect.height - 60) vy *= -1;
    
    x = Math.max(0, Math.min(x, appRect.width - 60));
    y = Math.max(0, Math.min(y, appRect.height - 60));
    
    element.style.left = x + "px";
    element.style.top = y + "px";
    
    requestAnimationFrame(animate);
  };
  
  requestAnimationFrame(animate);
}

/**
 * Handle clicking on an event
 */
function clickEvent() {
  if (!activeEvent) return;
  
  // Si c'est un quiz, ouvrir la fenêtre de quiz
  if (activeEvent.type.isQuiz) {
    openQuiz();
    return;
  }
  
  const reward = activeEvent.type.getReward(state);
  
  if (reward.type === "points") {
    state.points += reward.value;
    state.totalPointsEarned += reward.value;
    showNotification(`${activeEvent.type.icon} ${activeEvent.type.name} : +${formatNumber(reward.value)} postes !`);
  } else if (reward.type === "tempBoost") {
    activateTemporaryBoost(reward.value, reward.duration);
    showNotification(`${activeEvent.type.icon} ${activeEvent.type.name} : x${reward.value} production pendant ${reward.duration}s !`);
  }
  
  state.eventsClicked += 1;
  
  // Animation de clic
  activeEvent.element.classList.add("clicked");
  
  clearTimeout(activeEvent.timeout);
  setTimeout(() => {
    removeEvent();
  }, 200);
  
  saveGame();
  updateUI();
}

/**
 * Remove the current active event
 */
function removeEvent() {
  if (activeEvent && activeEvent.element) {
    activeEvent.element.remove();
  }
  activeEvent = null;
}

/**
 * Activate a temporary production boost
 * @param {number} multiplier - Boost multiplier
 * @param {number} duration - Duration in seconds
 */
function activateTemporaryBoost(multiplier, duration) {
  // Si un boost est déjà actif, le remplacer
  if (tempBoostTimeout) {
    clearTimeout(tempBoostTimeout);
    state.productionMultiplier = originalProductionMult;
  }
  
  originalProductionMult = state.productionMultiplier;
  state.productionMultiplier *= multiplier;
  recalcPPS();
  
  // Afficher l'indicateur de boost
  showBoostIndicator(duration);
  
  tempBoostTimeout = setTimeout(() => {
    state.productionMultiplier = originalProductionMult;
    recalcPPS();
    updateUI();
    tempBoostTimeout = null;
    hideBoostIndicator();
  }, duration * 1000);
}

/**
 * Show the boost indicator
 * @param {number} duration - Duration in seconds
 */
function showBoostIndicator(duration) {
  let indicator = document.getElementById("boost-indicator");
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.id = "boost-indicator";
    indicator.className = "boost-indicator";
    document.querySelector(".counters").appendChild(indicator);
  }
  indicator.textContent = `⚡ Boost actif !`;
  indicator.style.display = "block";
}

/**
 * Hide the boost indicator
 */
function hideBoostIndicator() {
  const indicator = document.getElementById("boost-indicator");
  if (indicator) {
    indicator.style.display = "none";
  }
}

/**
 * Schedule the next random event
 */
function scheduleNextEvent() {
  const delay = 15000 + Math.random() * 30000;
  setTimeout(() => {
    spawnRandomEvent();
    scheduleNextEvent();
  }, delay);
}
