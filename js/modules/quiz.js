/**
 * Quiz Module - Quiz Event System
 * NIRD Clicker Game
 */

// quizActive est déjà déclaré dans events.js (var quizActive)
let quizTimeout = null;
let quizTimerInterval = null;

/**
 * Open the quiz modal with a random question
 */
function openQuiz() {
  if (quizActive) return;
  
  quizActive = true;
  
  // Garder l'événement actif mais arrêter son timeout
  if (activeEvent) {
    clearTimeout(activeEvent.timeout);
    activeEvent.element.classList.add("clicked");
    setTimeout(() => {
      if (activeEvent && activeEvent.element) {
        activeEvent.element.remove();
      }
      activeEvent = null;
    }, 200);
  }
  
  // Choisir une question aléatoire
  const question = state.quizQuestions[Math.floor(Math.random() * state.quizQuestions.length)];
  const reward = Math.max(200, Math.floor(state.pointsPerSecond * 15));
  
  const quizHtml = `
    <div class="quiz-modal">
      <div class="quiz-content">
        <div class="quiz-header">
          <span class="quiz-icon">❓</span>
          <h3>Quiz NIRD</h3>
        </div>
        <div class="quiz-timer-bar">
          <div class="quiz-timer-fill" id="quizTimerFill"></div>
        </div>
        <div class="quiz-question">${question.question}</div>
        <div class="quiz-buttons">
          <button class="quiz-btn quiz-true" onclick="answerQuiz(true, ${question.answer}, ${reward})">✓ VRAI</button>
          <button class="quiz-btn quiz-false" onclick="answerQuiz(false, ${question.answer}, ${reward})">✗ FAUX</button>
        </div>
        <div class="quiz-reward">🎁 Récompense : +${formatNumber(reward)} postes</div>
      </div>
    </div>
  `;
  
  const modal = document.createElement("div");
  modal.id = "quiz-modal-container";
  modal.innerHTML = quizHtml;
  document.body.appendChild(modal);
  
  // Démarrer le timer de 5 secondes
  startQuizTimer(5, reward, question.answer);
}

/**
 * Start the quiz countdown timer
 * @param {number} duration - Duration in seconds
 * @param {number} reward - Reward amount
 * @param {boolean} correctAnswer - The correct answer
 */
function startQuizTimer(duration, reward, correctAnswer) {
  const timerFill = document.getElementById("quizTimerFill");
  const startTime = Date.now();
  
  // Animation de la barre
  quizTimerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, duration * 1000 - elapsed);
    const percent = (remaining / (duration * 1000)) * 100;
    
    if (timerFill) {
      timerFill.style.width = percent + "%";
      
      // Changer la couleur selon le temps restant
      if (percent < 30) {
        timerFill.style.background = "#ef4444";
      } else if (percent < 60) {
        timerFill.style.background = "#f59e0b";
      }
    }
    
    if (remaining <= 0) {
      clearInterval(quizTimerInterval);
      // Temps écoulé = mauvaise réponse
      answerQuiz(null, correctAnswer, reward);
    }
  }, 50);
  
  // Timeout de secours
  quizTimeout = setTimeout(() => {
    if (quizActive) {
      answerQuiz(null, correctAnswer, reward);
    }
  }, duration * 1000 + 100);
}

/**
 * Handle quiz answer
 * @param {boolean|null} userAnswer - User's answer (null if timeout)
 * @param {boolean} correctAnswer - The correct answer
 * @param {number} reward - Reward amount
 */
function answerQuiz(userAnswer, correctAnswer, reward) {
  // Nettoyer les timers
  if (quizTimerInterval) {
    clearInterval(quizTimerInterval);
    quizTimerInterval = null;
  }
  if (quizTimeout) {
    clearTimeout(quizTimeout);
    quizTimeout = null;
  }
  
  const modal = document.getElementById("quiz-modal-container");
  if (!modal) return;
  
  const isCorrect = userAnswer === correctAnswer;
  const isTimeout = userAnswer === null;
  
  // Afficher le résultat
  const content = modal.querySelector(".quiz-content");
  if (content) {
    content.innerHTML = `
      <div class="quiz-result ${isCorrect ? 'correct' : 'wrong'}">
        <div class="quiz-result-icon">${isTimeout ? '⏰' : (isCorrect ? '✅' : '❌')}</div>
        <div class="quiz-result-text">${isTimeout ? 'Temps écoulé !' : (isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse !')}</div>
        ${isCorrect ? `<div class="quiz-result-reward">+${formatNumber(reward)} postes !</div>` : ''}
      </div>
    `;
  }
  
  // Appliquer la récompense si correcte
  if (isCorrect) {
    state.points += reward;
    state.totalPointsEarned += reward;
    state.eventsClicked += 1;
    saveGame();
    updateUI();
  }
  
  // Fermer après 1.5 secondes
  setTimeout(() => {
    closeQuiz();
  }, 1500);
}

/**
 * Close the quiz modal
 */
function closeQuiz() {
  const modal = document.getElementById("quiz-modal-container");
  if (modal) modal.remove();
  
  quizActive = false;
  
  // Nettoyer les timers au cas où
  if (quizTimerInterval) {
    clearInterval(quizTimerInterval);
    quizTimerInterval = null;
  }
  if (quizTimeout) {
    clearTimeout(quizTimeout);
    quizTimeout = null;
  }
}

// Expose functions globally for HTML onclick
window.answerQuiz = answerQuiz;
window.closeQuiz = closeQuiz;
