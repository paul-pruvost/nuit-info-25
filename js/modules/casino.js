/**
 * Casino Module
 * NIRD Clicker Game - Mini-jeux de casino
 */

const CasinoModule = {
  // État
  isUnlocked: false,
  currentGame: null,
  isPlaying: false,
  currentBet: 100,
  
  // Éléments DOM
  elements: {},
  
  /**
   * Initialisation
   */
  init() {
    this.elements = {
      gameSelector: document.getElementById('casino-game-selector'),
      betInput: document.getElementById('casino-bet-input'),
      betSlider: document.getElementById('casino-bet-slider'),
      playBtn: document.getElementById('casino-play-btn'),
      
      // Conteneurs de jeux
      slotsGame: document.getElementById('casino-slots'),
      diceGame: document.getElementById('casino-dice'),
      blackjackGame: document.getElementById('casino-blackjack'),
      wheelGame: document.getElementById('casino-wheel')
    };
    
    // Event listeners
    if (this.elements.gameSelector) {
      this.elements.gameSelector.addEventListener('change', (e) => this.selectGame(e.target.value));
    }
    if (this.elements.betInput) {
      this.elements.betInput.addEventListener('input', (e) => this.updateSliderFromInput(e));
    }
    if (this.elements.betSlider) {
      this.elements.betSlider.addEventListener('input', (e) => this.updateInputFromSlider(e));
    }
    if (this.elements.playBtn) {
      this.elements.playBtn.addEventListener('click', () => this.play());
    }
    
    // Sélectionner le premier jeu par défaut
    this.selectGame('slots');
    
    // Vérifier déverrouillage
    this.checkUnlockSilent();
    this.updateUI();
    
    console.log('🎰 Casino module initialized');
  },
  
  /**
   * Vérifier déverrouillage (sans notification)
   */
  checkUnlockSilent() {
    this.isUnlocked = state.totalPointsEarned >= CASINO_CONFIG.unlockRequirement;
    
    if (this.isUnlocked) {
      const casinoTab = document.getElementById('casino-tab');
      if (casinoTab) {
        casinoTab.classList.remove('hidden');
      }
    }
    
    return this.isUnlocked;
  },
  
  /**
   * Vérifier déverrouillage (avec notification)
   */
  checkUnlock() {
    const wasUnlocked = this.isUnlocked;
    this.isUnlocked = state.totalPointsEarned >= CASINO_CONFIG.unlockRequirement;
    
    if (!wasUnlocked && this.isUnlocked) {
      const casinoTab = document.getElementById('casino-tab');
      if (casinoTab) {
        casinoTab.classList.remove('hidden');
        casinoTab.classList.add('newly-unlocked');
        casinoTab.style.animation = 'slideInFromRight 0.5s ease';
        
        setTimeout(() => casinoTab.classList.remove('newly-unlocked'), 10000);
      }
      
      showNotification('🎰 Casino débloqué!', 'Tentez votre chance avec 4 jeux différents!', 'success');
      
      setTimeout(() => this.showTutorial(), 1000);
    }
    
    return this.isUnlocked;
  },
  
  /**
   * Sélectionner un jeu
   */
  selectGame(gameType) {
    this.currentGame = gameType;
    
    // Masquer tous les jeux
    if (this.elements.slotsGame) this.elements.slotsGame.style.display = 'none';
    if (this.elements.diceGame) this.elements.diceGame.style.display = 'none';
    if (this.elements.blackjackGame) this.elements.blackjackGame.style.display = 'none';
    if (this.elements.wheelGame) this.elements.wheelGame.style.display = 'none';
    
    // Afficher le jeu sélectionné
    const gameElement = this.elements[gameType + 'Game'];
    if (gameElement) {
      gameElement.style.display = 'block';
    }
  },
  
  /**
   * Jouer au jeu sélectionné
   */
  play() {
    if (!this.checkUnlockSilent()) {
      showNotification('🔒 Casino verrouillé', CASINO_CONFIG.messages.locked, 'error');
      return;
    }
    
    if (this.isPlaying) return;
    
    const bet = parseInt(this.elements.betInput.value);
    
    if (bet < CASINO_CONFIG.minBet || bet > state.points) {
      showNotification('❌ Mise invalide', CASINO_CONFIG.messages.noPoints, 'error');
      return;
    }
    
    this.currentBet = bet;
    state.points -= bet;
    state.casinoPlays += 1;
    
    this.updateUI();
    saveGame();
    
    // Jouer au jeu sélectionné
    switch (this.currentGame) {
      case 'slots':
        this.playSlots();
        break;
      case 'dice':
        this.playDice();
        break;
      case 'blackjack':
        this.playBlackjack();
        break;
      case 'wheel':
        this.playWheel();
        break;
    }
  },
  
  /**
   * 🎰 Machine à sous
   */
  playSlots() {
    this.isPlaying = true;
    this.elements.playBtn.disabled = true;
    
    const reels = [
      document.getElementById('slot-reel-1'),
      document.getElementById('slot-reel-2'),
      document.getElementById('slot-reel-3')
    ];
    
    const symbols = CASINO_CONFIG.slots.symbols;
    const results = [];
    
    // Animation des rouleaux
    reels.forEach((reel, index) => {
      let spins = 0;
      const maxSpins = 20 + index * 5;
      
      const interval = setInterval(() => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = randomSymbol.char;
        spins++;
        
        if (spins >= maxSpins) {
          clearInterval(interval);
          const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
          reel.textContent = finalSymbol.char;
          results.push(finalSymbol);
          
          // Tous les rouleaux ont fini
          if (results.length === 3) {
            setTimeout(() => this.resolveSlots(results), 500);
          }
        }
      }, 100);
    });
  },
  
  /**
   * Résoudre le résultat des machines à sous
   */
  resolveSlots(results) {
    let winAmount = 0;
    let message = '';
    
    // Vérifier si les 3 symboles sont identiques
    if (results[0].name === results[1].name && results[1].name === results[2].name) {
      // JACKPOT si 3 Tux
      if (results[0].name === 'Tux') {
        winAmount = this.currentBet * CASINO_CONFIG.slots.jackpotMultiplier;
        message = `💰 JACKPOT TUX! ${results[0].char}${results[1].char}${results[2].char} → Gain: ${formatNumber(winAmount)} postes!`;
        showNotification('🎰 JACKPOT!', message, 'success');
      } else {
        winAmount = this.currentBet * results[0].multiplier;
        message = `🎉 Trois ${results[0].name}! ${results[0].char}${results[1].char}${results[2].char} → Gain: ${formatNumber(winAmount)} postes!`;
        showNotification('🎰 Gagné!', message, 'success');
      }
      state.casinoWins += 1;
    } 
    // Vérifier si 2 symboles identiques
    else if (results[0].name === results[1].name || results[1].name === results[2].name || results[0].name === results[2].name) {
      const matchingSymbol = results[0].name === results[1].name ? results[0] : 
                           results[1].name === results[2].name ? results[1] : results[0];
      winAmount = Math.floor(this.currentBet * matchingSymbol.multiplier * 0.5);
      message = `🎊 Deux ${matchingSymbol.name}! → Gain: ${formatNumber(winAmount)} postes`;
      showNotification('🎰 Petit gain', message, 'warning');
      state.casinoWins += 1;
    } else {
      message = `😢 ${results[0].char}${results[1].char}${results[2].char} → Perdu ${formatNumber(this.currentBet)} postes`;
      showNotification('🎰 Perdu', message, 'error');
    }
    
    state.points += winAmount;
    state.casinoProfit += (winAmount - this.currentBet);
    
    this.isPlaying = false;
    this.elements.playBtn.disabled = false;
    this.updateUI();
    updateUI();
    saveGame();
  },
  
  /**
   * 🎲 Jeu de dés
   */
  playDice() {
    this.isPlaying = true;
    this.elements.playBtn.disabled = true;
    
    const dice1El = document.getElementById('dice-1');
    const dice2El = document.getElementById('dice-2');
    const resultEl = document.getElementById('dice-result');
    
    // Animation
    let rolls = 0;
    const interval = setInterval(() => {
      dice1El.textContent = Math.floor(Math.random() * 6) + 1;
      dice2El.textContent = Math.floor(Math.random() * 6) + 1;
      rolls++;
      
      if (rolls >= 15) {
        clearInterval(interval);
        
        // Résultat final
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        
        dice1El.textContent = dice1;
        dice2El.textContent = dice2;
        resultEl.textContent = total;
        
        setTimeout(() => this.resolveDice(dice1, dice2, total), 500);
      }
    }, 100);
  },
  
  /**
   * Résoudre le résultat des dés
   */
  resolveDice(dice1, dice2, total) {
    let multiplier = 0;
    let message = '';
    
    // Doubles
    if (dice1 === dice2) {
      multiplier = CASINO_CONFIG.dice.payouts.doubles;
      message = `🎲 Doubles (${dice1}-${dice2})! x${multiplier}`;
    }
    // Snake eyes ou Boxcars
    else if (total === 2 || total === 12) {
      multiplier = CASINO_CONFIG.dice.payouts[total];
      message = `🎲 ${total === 2 ? 'Snake Eyes' : 'Boxcars'}! (${dice1}-${dice2}) x${multiplier}`;
    }
    // 7 ou 11
    else if (total === 7 || total === 11) {
      multiplier = CASINO_CONFIG.dice.payouts[total];
      message = `🎲 ${total}! (${dice1}-${dice2}) x${multiplier}`;
    }
    
    const winAmount = Math.floor(this.currentBet * multiplier);
    
    if (winAmount > 0) {
      showNotification('🎲 Gagné!', message + ` → ${formatNumber(winAmount)} postes`, 'success');
      state.casinoWins += 1;
    } else {
      showNotification('🎲 Perdu', `(${dice1}-${dice2}) = ${total} → Perdu ${formatNumber(this.currentBet)} postes`, 'error');
    }
    
    state.points += winAmount;
    state.casinoProfit += (winAmount - this.currentBet);
    
    this.isPlaying = false;
    this.elements.playBtn.disabled = false;
    this.updateUI();
    updateUI();
    saveGame();
  },
  
  /**
   * 🃏 Blackjack
   */
  playBlackjack() {
    this.isPlaying = true;
    this.elements.playBtn.disabled = true;
    
    // Distribution initiale
    const playerHand = [this.drawCard(), this.drawCard()];
    const dealerHand = [this.drawCard(), this.drawCard()];
    
    const playerScore = this.calculateScore(playerHand);
    const dealerScore = this.calculateScore(dealerHand);
    
    document.getElementById('blackjack-player-cards').textContent = playerHand.join(' ');
    document.getElementById('blackjack-player-score').textContent = playerScore;
    document.getElementById('blackjack-dealer-cards').textContent = dealerHand[0] + ' 🂠';
    document.getElementById('blackjack-dealer-score').textContent = '?';
    
    // Vérifier blackjack naturel
    if (playerScore === 21) {
      setTimeout(() => this.resolveBlackjack(playerHand, dealerHand, true), 1000);
      return;
    }
    
    // Simuler les choix du joueur (simplifié)
    setTimeout(() => {
      // Le joueur tire jusqu'à 17
      while (this.calculateScore(playerHand) < 17) {
        playerHand.push(this.drawCard());
      }
      
      document.getElementById('blackjack-player-cards').textContent = playerHand.join(' ');
      document.getElementById('blackjack-player-score').textContent = this.calculateScore(playerHand);
      
      setTimeout(() => this.resolveBlackjack(playerHand, dealerHand), 1000);
    }, 1500);
  },
  
  /**
   * Résoudre le blackjack
   */
  resolveBlackjack(playerHand, dealerHand, playerBlackjack = false) {
    let playerScore = this.calculateScore(playerHand);
    let dealerScore = this.calculateScore(dealerHand);
    
    // Le croupier tire jusqu'à 17
    while (dealerScore < CASINO_CONFIG.blackjack.dealerStandsOn) {
      dealerHand.push(this.drawCard());
      dealerScore = this.calculateScore(dealerHand);
    }
    
    document.getElementById('blackjack-dealer-cards').textContent = dealerHand.join(' ');
    document.getElementById('blackjack-dealer-score').textContent = dealerScore;
    
    let winAmount = 0;
    let message = '';
    
    if (playerScore > 21) {
      message = `🃏 Bust! ${playerScore} → Perdu`;
    } else if (dealerScore > 21) {
      winAmount = Math.floor(this.currentBet * CASINO_CONFIG.blackjack.winMultiplier);
      message = `🃏 Le croupier bust! Vous gagnez ${formatNumber(winAmount)} postes`;
      state.casinoWins += 1;
    } else if (playerBlackjack && dealerScore !== 21) {
      winAmount = Math.floor(this.currentBet * CASINO_CONFIG.blackjack.blackjackMultiplier);
      message = `🃏 Blackjack! Vous gagnez ${formatNumber(winAmount)} postes`;
      state.casinoWins += 1;
    } else if (playerScore > dealerScore) {
      winAmount = Math.floor(this.currentBet * CASINO_CONFIG.blackjack.winMultiplier);
      message = `🃏 ${playerScore} vs ${dealerScore} - Vous gagnez ${formatNumber(winAmount)} postes`;
      state.casinoWins += 1;
    } else if (playerScore === dealerScore) {
      winAmount = this.currentBet;
      message = `🃏 Égalité ${playerScore} - Mise rendue`;
    } else {
      message = `🃏 ${playerScore} vs ${dealerScore} - Perdu`;
    }
    
    showNotification('🃏 Blackjack', message, winAmount > 0 ? 'success' : 'error');
    
    state.points += winAmount;
    state.casinoProfit += (winAmount - this.currentBet);
    
    this.isPlaying = false;
    this.elements.playBtn.disabled = false;
    this.updateUI();
    updateUI();
    saveGame();
  },
  
  /**
   * Tirer une carte
   */
  drawCard() {
    const cards = ['🂡', '🂢', '🂣', '🂤', '🂥', '🂦', '🂧', '🂨', '🂩', '🂪', '🂫', '🂭', '🂮'];
    return cards[Math.floor(Math.random() * cards.length)];
  },
  
  /**
   * Calculer le score au blackjack
   */
  calculateScore(hand) {
    // Simplification: chaque carte vaut entre 2 et 11
    let score = 0;
    hand.forEach(() => {
      score += Math.floor(Math.random() * 10) + 2;
    });
    return Math.min(score, 21 + Math.floor(Math.random() * 10));
  },
  
  /**
   * 🎯 Roue de la Fortune
   */
  playWheel() {
    this.isPlaying = true;
    this.elements.playBtn.disabled = true;
    
    const wheelEl = document.getElementById('wheel-spinner');
    const resultEl = document.getElementById('wheel-result');
    
    // Sélectionner un segment basé sur les probabilités
    const segments = CASINO_CONFIG.wheel.segments;
    const rand = Math.random();
    let cumulative = 0;
    let selectedSegment = segments[segments.length - 1];
    
    for (const segment of segments) {
      cumulative += segment.probability;
      if (rand <= cumulative) {
        selectedSegment = segment;
        break;
      }
    }
    
    // Animation de rotation
    const rotations = 5 + Math.random() * 3;
    const finalRotation = rotations * 360;
    
    wheelEl.style.transition = `transform ${CASINO_CONFIG.wheel.spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
    wheelEl.style.transform = `rotate(${finalRotation}deg)`;
    
    setTimeout(() => {
      resultEl.textContent = selectedSegment.label;
      resultEl.style.color = selectedSegment.color;
      
      setTimeout(() => this.resolveWheel(selectedSegment), 500);
    }, CASINO_CONFIG.wheel.spinDuration);
  },
  
  /**
   * Résoudre la roue
   */
  resolveWheel(segment) {
    const winAmount = Math.floor(this.currentBet * segment.multiplier);
    
    if (winAmount > 0) {
      const message = `🎯 ${segment.label} → Gain: ${formatNumber(winAmount)} postes`;
      showNotification('🎯 Gagné!', message, segment.multiplier >= 5 ? 'success' : 'warning');
      state.casinoWins += 1;
    } else {
      showNotification('🎯 Perdu', `${segment.label} → Perdu ${formatNumber(this.currentBet)} postes`, 'error');
    }
    
    state.points += winAmount;
    state.casinoProfit += (winAmount - this.currentBet);
    
    // Réinitialiser la roue
    const wheelEl = document.getElementById('wheel-spinner');
    wheelEl.style.transition = 'none';
    wheelEl.style.transform = 'rotate(0deg)';
    
    this.isPlaying = false;
    this.elements.playBtn.disabled = false;
    this.updateUI();
    updateUI();
    saveGame();
  },
  
  /**
   * Mettre à jour le slider depuis l'input
   */
  updateSliderFromInput(e) {
    const value = parseInt(e.target.value) || 0;
    this.elements.betSlider.value = value;
  },
  
  /**
   * Mettre à jour l'input depuis le slider
   */
  updateInputFromSlider(e) {
    const value = parseInt(e.target.value) || 0;
    this.elements.betInput.value = value;
  },
  
  /**
   * Mettre à jour l'UI
   */
  updateUI() {
    this.checkUnlockSilent();
    
    const maxBet = Math.min(CASINO_CONFIG.maxBet, state.points);
    if (this.elements.betInput) this.elements.betInput.max = maxBet;
    if (this.elements.betSlider) this.elements.betSlider.max = maxBet;
    if (this.elements.playBtn) {
      this.elements.playBtn.disabled = !this.isUnlocked || this.isPlaying || state.points < CASINO_CONFIG.minBet;
    }
    
    // Mettre à jour les statistiques
    const playsEl = document.getElementById('casino-plays');
    const winsEl = document.getElementById('casino-wins');
    const profitEl = document.getElementById('casino-profit');
    
    if (playsEl) playsEl.textContent = state.casinoPlays;
    if (winsEl) winsEl.textContent = state.casinoWins;
    if (profitEl) {
      const profit = state.casinoProfit;
      profitEl.textContent = (profit >= 0 ? '+' : '') + formatNumber(profit);
      profitEl.style.color = profit >= 0 ? '#10b981' : '#ef4444';
    }
  },
  
  /**
   * Afficher le tutoriel
   */
  showTutorial() {
    if (localStorage.getItem('nird-casino-tutorial-completed')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'tutorial-overlay';
    overlay.innerHTML = `
      <div class="tutorial-container">
        <div class="tutorial-header">
          <div class="tutorial-logo">🎰</div>
          <h2 class="tutorial-title">Bienvenue au Casino NIRD!</h2>
          <p class="tutorial-subtitle">4 jeux pour tenter votre chance</p>
        </div>
        
        <div id="tutorial-content">
          <div class="tutorial-steps active">
            <div class="tutorial-step">
              <div class="tutorial-step-icon">🎲</div>
              <h3 class="tutorial-step-title">Tentez votre chance!</h3>
              <p class="tutorial-step-text">
                Le <strong>Casino NIRD</strong> vous propose 4 jeux de hasard pour multiplier vos postes... ou les perdre! 🎰
              </p>
              
              <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px; margin: 16px 0;">
                <h4 style="margin: 0 0 12px 0; color: #f59e0b;">🎮 Les 4 jeux:</h4>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li><strong>🎰 Machine à sous</strong> - Alignez 3 symboles NIRD</li>
                  <li><strong>🎲 Dés du NIRD</strong> - Lancez les dés, 7/11 ou doubles gagnent</li>
                  <li><strong>🃏 Blackjack</strong> - Approchez-vous de 21</li>
                  <li><strong>🎯 Roue de la Fortune</strong> - Faites tourner pour gagner jusqu'à x10</li>
                </ul>
              </div>
              
              <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.3); margin-top: 12px;">
                <strong>⚠️ Attention:</strong> Le casino est risqué!
                <p style="margin: 8px 0 0 0; font-size: 0.9em;">
                  Placez une mise, choisissez votre jeu et cliquez sur "Jouer". 
                  Les probabilités varient selon le jeu choisi.
                </p>
              </div>
              
              <p style="margin-top: 16px; opacity: 0.8; font-size: 0.9em;">
                💡 <strong>Conseil:</strong> Commencez avec de petites mises pour comprendre les mécaniques!
              </p>
            </div>
          </div>
        </div>
        
        <div class="tutorial-buttons">
          <button class="tutorial-btn tutorial-btn-start" onclick="CasinoModule.closeTutorial()">
            🎰 Compris, allons jouer!
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
  },
  
  /**
   * Fermer le tutoriel
   */
  closeTutorial() {
    localStorage.setItem('nird-casino-tutorial-completed', 'true');
    const overlay = document.querySelector('.tutorial-overlay');
    if (overlay) {
      overlay.classList.add('hiding');
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 500);
    }
  }
};
