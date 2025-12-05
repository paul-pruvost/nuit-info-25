/**
 * NIRD Decryption Module
 * Système de décryptage de l'acronyme NIRD
 */

const NirdModule = {
  isAnimating: false,
  
  /**
   * Initialise le module NIRD
   */
  init() {
    this.renderSlots();
    this.updateUI();
    this.bindEvents();
  },
  
  /**
   * Crée les emplacements pour les lettres NIRD
   */
  renderSlots() {
    const container = document.getElementById('nird-slots');
    if (!container) return;
    
    container.innerHTML = '';
    
    NIRD_CONFIG.letters.forEach((letterData, index) => {
      const slot = document.createElement('div');
      slot.className = 'nird-slot';
      slot.dataset.index = index;
      
      const letterDisplay = document.createElement('div');
      letterDisplay.className = 'nird-letter';
      letterDisplay.id = `nird-letter-${index}`;
      
      if (state.nirdUnlocked[index]) {
        letterDisplay.textContent = letterData.letter;
        letterDisplay.classList.add('unlocked');
        slot.classList.add('unlocked');
        
        // Ajouter l'infobulle pour les lettres débloquées
        const tooltip = document.createElement('div');
        tooltip.className = 'nird-tooltip';
        tooltip.innerHTML = `
          <div class="nird-tooltip-header">
            <span class="nird-tooltip-icon">${letterData.icon}</span>
            <span class="nird-tooltip-word">${letterData.letter} = ${letterData.word}</span>
          </div>
          <p class="nird-tooltip-desc">${letterData.description}</p>
        `;
        slot.appendChild(tooltip);
      } else {
        letterDisplay.textContent = '?';
        letterDisplay.classList.add('locked');
      }
      
      slot.appendChild(letterDisplay);
      container.appendChild(slot);
    });
  },
  
  /**
   * Met à jour l'interface utilisateur
   */
  updateUI() {
    const costDisplay = document.getElementById('nird-cost');
    const chanceDisplay = document.getElementById('nird-chance');
    const inputField = document.getElementById('nird-points-input');
    const attemptBtn = document.getElementById('nird-attempt-btn');
    
    if (!costDisplay || !inputField) return;
    
    const pointsToSpend = parseInt(inputField.value) || 0;
    const minCost = this.getMinCost();
    const successRate = this.calculateSuccessRate(pointsToSpend);
    
    costDisplay.textContent = `Coût minimum : ${formatNumber(minCost)} postes`;
    chanceDisplay.textContent = `Chance de succès : ${successRate.toFixed(1)}%`;
    
    // Activer/désactiver le bouton
    const canAttempt = pointsToSpend >= minCost && 
                       pointsToSpend <= state.points && 
                       !this.isAnimating &&
                       !this.isFullyUnlocked();
    
    if (attemptBtn) {
      attemptBtn.disabled = !canAttempt;
    }
    
    // Mettre à jour le max de l'input
    inputField.max = Math.floor(state.points);
    
    // Message si tout est débloqué
    const statusEl = document.getElementById('nird-status');
    if (statusEl) {
      if (this.isFullyUnlocked()) {
        statusEl.innerHTML = '<span class="nird-complete">🎉 Félicitations ! Tu as décrypté l\'acronyme NIRD !</span>';
      } else {
        const unlockedCount = state.nirdUnlocked.filter(Boolean).length;
        statusEl.textContent = `${unlockedCount}/4 lettres débloquées`;
      }
    }
  },
  
  /**
   * Attache les événements
   */
  bindEvents() {
    const inputField = document.getElementById('nird-points-input');
    const attemptBtn = document.getElementById('nird-attempt-btn');
    const slider = document.getElementById('nird-points-slider');
    
    if (inputField) {
      inputField.addEventListener('input', () => {
        if (slider) slider.value = inputField.value;
        this.updateUI();
      });
    }
    
    if (slider) {
      slider.addEventListener('input', () => {
        if (inputField) inputField.value = slider.value;
        this.updateUI();
      });
    }
    
    if (attemptBtn) {
      attemptBtn.addEventListener('click', () => this.attemptDecrypt());
    }
  },
  
  /**
   * Obtient le coût minimum pour une tentative
   */
  getMinCost() {
    const unlockedCount = state.nirdUnlocked.filter(Boolean).length;
    return Math.floor(NIRD_CONFIG.baseCost * Math.pow(NIRD_CONFIG.costMultiplier, unlockedCount));
  },
  
  /**
   * Calcule le taux de succès basé sur les points dépensés
   */
  calculateSuccessRate(points) {
    if (points <= 0) return 0;
    
    const minCost = this.getMinCost();
    if (points < minCost) return 0;
    
    // Progression logarithmique pour le taux de succès
    const ratio = points / NIRD_CONFIG.pointsForMaxRate;
    const rate = NIRD_CONFIG.baseSuccessRate + 
                 (NIRD_CONFIG.maxSuccessRate - NIRD_CONFIG.baseSuccessRate) * 
                 Math.min(1, Math.sqrt(ratio));
    
    return Math.min(NIRD_CONFIG.maxSuccessRate, rate);
  },
  
  /**
   * Vérifie si toutes les lettres sont débloquées
   */
  isFullyUnlocked() {
    return state.nirdUnlocked.every(Boolean);
  },
  
  /**
   * Obtient l'index de la prochaine lettre à débloquer
   */
  getNextLetterIndex() {
    return state.nirdUnlocked.findIndex(unlocked => !unlocked);
  },
  
  /**
   * Lance une tentative de décryptage
   */
  attemptDecrypt() {
    const inputField = document.getElementById('nird-points-input');
    const pointsToSpend = parseInt(inputField.value) || 0;
    const minCost = this.getMinCost();
    
    if (pointsToSpend < minCost || pointsToSpend > state.points || this.isAnimating) {
      return;
    }
    
    // Déduire les points
    state.points -= pointsToSpend;
    
    // Calculer si succès
    const successRate = this.calculateSuccessRate(pointsToSpend);
    const isSuccess = Math.random() * 100 < successRate;
    
    // Lancer l'animation
    this.playAnimation(isSuccess);
    
    updateUI();
  },
  
  /**
   * Joue l'animation style casino
   */
  playAnimation(isSuccess) {
    this.isAnimating = true;
    
    const attemptBtn = document.getElementById('nird-attempt-btn');
    if (attemptBtn) attemptBtn.disabled = true;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const slots = document.querySelectorAll('.nird-letter');
    const nextIndex = this.getNextLetterIndex();
    
    // Démarrer l'animation pour tous les slots non débloqués
    const intervals = [];
    
    slots.forEach((slot, index) => {
      if (!state.nirdUnlocked[index]) {
        slot.classList.add('spinning');
        
        const interval = setInterval(() => {
          slot.textContent = letters[Math.floor(Math.random() * letters.length)];
        }, NIRD_CONFIG.animationInterval);
        
        intervals.push({ interval, index, slot });
      }
    });
    
    // Arrêter progressivement les slots
    const stopDelay = NIRD_CONFIG.animationDuration / (intervals.length + 1);
    
    intervals.forEach((item, i) => {
      setTimeout(() => {
        clearInterval(item.interval);
        item.slot.classList.remove('spinning');
        
        // Si c'est le slot cible et succès, révéler la lettre
        if (isSuccess && item.index === nextIndex) {
          this.revealLetter(item.index);
        } else {
          item.slot.textContent = '?';
          item.slot.classList.add('shake');
          setTimeout(() => item.slot.classList.remove('shake'), 500);
        }
        
        // Si c'est le dernier slot
        if (i === intervals.length - 1) {
          this.isAnimating = false;
          this.updateUI();
          
          if (isSuccess) {
            showNotification(`🎉 Lettre "${NIRD_CONFIG.letters[nextIndex].letter}" débloquée !`, 'success');
            
            // Vérifier si tout est débloqué
            if (this.isFullyUnlocked()) {
              setTimeout(() => {
                this.showCompletionModal();
              }, 1000);
            }
          } else {
            showNotification('❌ Échec du décryptage... Réessaie avec plus de postes !', 'error');
          }
        }
      }, stopDelay * (i + 1));
    });
  },
  
  /**
   * Révèle une lettre avec animation
   */
  revealLetter(index) {
    state.nirdUnlocked[index] = true;
    
    const slot = document.querySelector(`.nird-slot[data-index="${index}"]`);
    const letterEl = document.getElementById(`nird-letter-${index}`);
    const letterData = NIRD_CONFIG.letters[index];
    
    if (letterEl) {
      letterEl.textContent = letterData.letter;
      letterEl.classList.remove('locked');
      letterEl.classList.add('unlocked', 'reveal');
    }
    
    if (slot) {
      slot.classList.add('unlocked');
      
      // Ajouter l'infobulle
      const tooltip = document.createElement('div');
      tooltip.className = 'nird-tooltip';
      tooltip.innerHTML = `
        <div class="nird-tooltip-header">
          <span class="nird-tooltip-icon">${letterData.icon}</span>
          <span class="nird-tooltip-word">${letterData.letter} = ${letterData.word}</span>
        </div>
        <p class="nird-tooltip-desc">${letterData.description}</p>
      `;
      slot.appendChild(tooltip);
      
      // Animation de révélation
      setTimeout(() => {
        tooltip.classList.add('show');
        setTimeout(() => tooltip.classList.remove('show'), 3000);
      }, 100);
    }
    
    // Sauvegarder
    if (typeof SaveModule !== 'undefined') {
      SaveModule.save();
    }
  },
  
  /**
   * Met à jour le slider max quand les points changent
   */
  refreshSlider() {
    const slider = document.getElementById('nird-points-slider');
    const input = document.getElementById('nird-points-input');
    const maxPoints = Math.floor(state.points);
    
    if (slider) {
      slider.max = maxPoints;
      // Corriger la valeur si elle dépasse le max
      if (parseInt(slider.value) > maxPoints) {
        slider.value = maxPoints;
      }
    }
    if (input) {
      input.max = maxPoints;
      // Corriger la valeur si elle dépasse le max
      if (parseInt(input.value) > maxPoints) {
        input.value = maxPoints;
      }
    }
  },
  
  /**
   * Affiche le modal de fin avec le récapitulatif complet de NIRD
   */
  showCompletionModal() {
    const letters = NIRD_CONFIG.letters;
    
    const modalHtml = `
      <div class="nird-completion-modal">
        <div class="nird-completion-content">
          <div class="nird-completion-confetti"></div>
          <h2 class="nird-completion-title">🎉 Félicitations ! 🎉</h2>
          <p class="nird-completion-subtitle">Tu as décrypté l'acronyme <strong>NIRD</strong> !</p>
          
          <div class="nird-completion-summary">
            ${letters.map(l => `
              <div class="nird-completion-letter">
                <div class="nird-completion-letter-header">
                  <span class="nird-completion-letter-icon">${l.icon}</span>
                  <span class="nird-completion-letter-char">${l.letter}</span>
                  <span class="nird-completion-letter-word">= ${l.word}</span>
                </div>
                <p class="nird-completion-letter-desc">${l.description}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="nird-completion-message">
            <p>🌍 <strong>Le Numérique Inclusif, Responsable et Durable</strong> est une approche qui vise à concilier innovation technologique et respect des enjeux sociaux et environnementaux.</p>
            <p>En adoptant ces principes, nous pouvons construire un avenir numérique plus équitable et plus respectueux de notre planète ! 🌱</p>
          </div>
          
          <button class="nird-completion-close" onclick="NirdModule.closeCompletionModal()">Continuer à jouer</button>
        </div>
      </div>
    `;
    
    const modal = document.createElement('div');
    modal.id = 'nird-completion-modal-container';
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
    
    // Lancer l'animation de confettis
    this.launchConfetti();
  },
  
  /**
   * Ferme le modal de fin
   */
  closeCompletionModal() {
    const modal = document.getElementById('nird-completion-modal-container');
    if (modal) modal.remove();
  },
  
  /**
   * Lance les confettis pour célébrer la victoire
   */
  launchConfetti() {
    const container = document.querySelector('.nird-completion-confetti');
    if (!container) return;
    
    const colors = ['#4ade80', '#4a90d9', '#fbbf24', '#f87171', '#a78bfa', '#34d399'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      container.appendChild(confetti);
    }
  }
};
