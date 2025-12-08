/**
 * Trading Module
 * NIRD Clicker Game - Système de trading de postes
 */

const TradingModule = {
  // État du module
  isUnlocked: false,
  isTrading: false,
  currentInvestment: 0,
  tradeStartTime: 0,
  
  // Données du graphique
  marketData: [],
  maxDataPoints: 30,
  currentValue: 100,
  
  // Éléments DOM
  elements: {},
  
  // Canvas
  canvas: null,
  ctx: null,
  
  // Conteneur de progression
  progressContainer: null,
  
  /**
   * Initialisation du module
   */
  init() {
    // Récupérer les éléments DOM
    this.elements = {
      container: document.getElementById('trading-container'),
      canvas: document.getElementById('trading-chart'),
      investInput: document.getElementById('trading-invest-input'),
      investSlider: document.getElementById('trading-invest-slider'),
      investBtn: document.getElementById('trading-invest-btn'),
      statusText: document.getElementById('trading-status'),
      progressBar: document.getElementById('trading-progress'),
      currentValue: document.getElementById('trading-current-value'),
      investedAmount: document.getElementById('trading-invested-amount'),
      potentialReturn: document.getElementById('trading-potential-return')
    };
    
    // Récupérer le conteneur de progression
    this.progressContainer = document.querySelector('.trading-progress-container');
    
    // Initialiser le canvas
    this.canvas = this.elements.canvas;
    this.ctx = this.canvas.getContext('2d');
    
    // Ajuster la résolution du canvas
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Initialiser les données du marché
    this.initMarketData();
    
    // Event listeners
    this.elements.investInput.addEventListener('input', (e) => this.updateSliderFromInput(e));
    this.elements.investSlider.addEventListener('input', (e) => this.updateInputFromSlider(e));
    this.elements.investBtn.addEventListener('click', () => this.startTrade());
    
    // Démarrer la mise à jour du marché
    setInterval(() => this.updateMarket(), TRADING_CONFIG.updateInterval);
    
    // Vérifier si le trading est déjà débloqué (au chargement)
    this.checkUnlockSilent();
    
    // Mettre à jour l'interface
    this.updateUI();
    
    // Dessiner le graphique initial après un court délai
    setTimeout(() => {
      this.resizeCanvas();
      this.drawChart();
    }, 100);
    
    console.log('💹 Trading module initialized');
  },
  
  /**
   * Vérifier si le trading est débloqué (sans notification ni tutoriel)
   */
  checkUnlockSilent() {
    this.isUnlocked = state.totalPointsEarned >= TRADING_CONFIG.unlockRequirement;
    
    // Si déjà débloqué, afficher l'onglet sans animation
    if (this.isUnlocked) {
      const tradingTab = document.getElementById('trading-tab');
      if (tradingTab) {
        tradingTab.classList.remove('hidden');
      }
    }
    
    return this.isUnlocked;
  },
  
  /**
   * Vérifier si le trading est débloqué
   */
  checkUnlock() {
    const wasUnlocked = this.isUnlocked;
    this.isUnlocked = state.totalPointsEarned >= TRADING_CONFIG.unlockRequirement;
    
    // Notification de déverrouillage
    if (!wasUnlocked && this.isUnlocked) {
      // Afficher l'onglet Trading
      const tradingTab = document.getElementById('trading-tab');
      if (tradingTab) {
        tradingTab.classList.remove('hidden');
        tradingTab.classList.add('newly-unlocked');
        // Animation d'apparition
        tradingTab.style.animation = 'slideInFromRight 0.5s ease';
        
        // Retirer le badge après 10 secondes
        setTimeout(() => {
          tradingTab.classList.remove('newly-unlocked');
        }, 10000);
      }
      
      // Notification
      showNotification('💹 Trading débloqué!', 'Vous pouvez maintenant investir vos postes sur le marché!', 'success');
      
      // Afficher le tutoriel du trading après un court délai
      setTimeout(() => this.showTutorial(), 1000);
    }
    
    return this.isUnlocked;
  },
  
  /**
   * Initialiser les données du marché
   */
  initMarketData() {
    this.marketData = [];
    for (let i = 0; i < this.maxDataPoints; i++) {
      this.marketData.push(100);
    }
  },
  
  /**
   * Mettre à jour le marché
   */
  updateMarket() {
    // Calculer la nouvelle valeur avec volatilité
    const change = (Math.random() - 0.5) * 2 * TRADING_CONFIG.volatility * 10;
    this.currentValue = Math.max(50, Math.min(150, this.currentValue + change));
    
    // Ajouter au graphique
    this.marketData.push(this.currentValue);
    if (this.marketData.length > this.maxDataPoints) {
      this.marketData.shift();
    }
    
    // Redessiner
    this.drawChart();
    this.updateUI();
  },
  
  /**
   * Redimensionner le canvas
   */
  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    
    // Vérifier que le canvas a des dimensions valides
    if (rect.width === 0 || rect.height === 0) {
      console.warn('Canvas has no dimensions, skipping resize');
      return;
    }
    
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.drawChart();
  },
  
  /**
   * Dessiner le graphique
   */
  drawChart() {
    if (!this.ctx || !this.canvas) return;
    
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Effacer le canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Grille
    this.ctx.strokeStyle = TRADING_CONFIG.colors.grid;
    this.ctx.lineWidth = 1;
    
    // Lignes horizontales
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(width - padding, y);
      this.ctx.stroke();
      
      // Labels
      const value = 150 - (i * 25);
      this.ctx.fillStyle = '#888';
      this.ctx.font = '11px system-ui';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(value.toString(), padding - 10, y + 4);
    }
    
    // Ligne centrale (100)
    this.ctx.strokeStyle = TRADING_CONFIG.colors.neutral;
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    const centerY = padding + chartHeight / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(padding, centerY);
    this.ctx.lineTo(width - padding, centerY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    
    // Dessiner la courbe
    if (this.marketData.length > 1) {
      const stepX = chartWidth / (this.maxDataPoints - 1);
      
      // Zone de remplissage
      this.ctx.fillStyle = TRADING_CONFIG.colors.fill;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, height - padding);
      
      this.marketData.forEach((value, i) => {
        const x = padding + i * stepX;
        const y = padding + chartHeight - ((value - 50) / 100) * chartHeight;
        if (i === 0) {
          this.ctx.lineTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      });
      
      this.ctx.lineTo(width - padding, height - padding);
      this.ctx.closePath();
      this.ctx.fill();
      
      // Ligne
      this.ctx.strokeStyle = TRADING_CONFIG.colors.line;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      
      this.marketData.forEach((value, i) => {
        const x = padding + i * stepX;
        const y = padding + chartHeight - ((value - 50) / 100) * chartHeight;
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      });
      
      this.ctx.stroke();
      
      // Point actuel
      const lastX = padding + (this.marketData.length - 1) * stepX;
      const lastY = padding + chartHeight - ((this.currentValue - 50) / 100) * chartHeight;
      
      this.ctx.fillStyle = this.currentValue >= 100 ? TRADING_CONFIG.colors.positive : TRADING_CONFIG.colors.negative;
      this.ctx.beginPath();
      this.ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Axes
    this.ctx.strokeStyle = '#666';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, height - padding);
    this.ctx.lineTo(width - padding, height - padding);
    this.ctx.stroke();
  },
  
  /**
   * Démarrer un trade
   */
  startTrade() {
    if (!this.checkUnlock()) {
      showNotification('🔒 Trading verrouillé', TRADING_CONFIG.messages.locked, 'error');
      return;
    }
    
    if (this.isTrading) {
      showNotification('⏳ Trading en cours', TRADING_CONFIG.messages.tradingInProgress, 'warning');
      return;
    }
    
    const investment = parseInt(this.elements.investInput.value);
    
    if (investment < TRADING_CONFIG.minInvestment || investment > state.points) {
      showNotification('❌ Investissement invalide', TRADING_CONFIG.messages.noPoints, 'error');
      return;
    }
    
    // Déduire les postes
    state.points -= investment;
    this.currentInvestment = investment;
    this.isTrading = true;
    this.tradeStartTime = Date.now();
    
    // Désactiver le bouton
    this.elements.investBtn.disabled = true;
    this.elements.investInput.disabled = true;
    this.elements.investSlider.disabled = true;
    
    // Afficher la barre de progression
    if (this.progressContainer) {
      this.progressContainer.style.display = 'block';
    }
    
    // Mettre à jour l'UI
    this.updateUI();
    saveGame();
    
    // Démarrer l'animation de progression
    this.animateProgress();
    
    // Résoudre le trade après la durée
    setTimeout(() => this.resolveTrade(), TRADING_CONFIG.tradeDuration);
  },
  
  /**
   * Animer la barre de progression
   */
  animateProgress() {
    if (!this.isTrading) return;
    
    const elapsed = Date.now() - this.tradeStartTime;
    const progress = Math.min(100, (elapsed / TRADING_CONFIG.tradeDuration) * 100);
    
    this.elements.progressBar.style.width = progress + '%';
    
    if (progress < 100) {
      requestAnimationFrame(() => this.animateProgress());
    }
  },
  
  /**
   * Résoudre le trade
   */
  resolveTrade() {
    // Sélectionner un résultat basé sur les probabilités
    const rand = Math.random();
    let cumulative = 0;
    let result = TRADING_CONFIG.multipliers[0];
    
    for (const mult of TRADING_CONFIG.multipliers) {
      cumulative += mult.probability;
      if (rand <= cumulative) {
        result = mult;
        break;
      }
    }
    
    // Calculer le retour
    const returns = Math.floor(this.currentInvestment * result.value);
    const profit = returns - this.currentInvestment;
    
    // Mettre à jour les statistiques
    state.totalTrades += 1;
    if (profit > 0) {
      state.successfulTrades += 1;
    }
    state.tradingProfit += profit;
    
    // Ajouter les gains
    state.points += returns;
    
    // Message de notification
    let message = `Investi: ${formatNumber(this.currentInvestment)} postes\n`;
    message += `Retour: ${formatNumber(returns)} postes\n`;
    
    if (profit > 0) {
      message += `Profit: +${formatNumber(profit)} postes 🎉`;
    } else if (profit < 0) {
      message += `Perte: ${formatNumber(profit)} postes 😢`;
    } else {
      message += `Neutre: ±0 postes`;
    }
    
    const notifType = profit > 0 ? 'success' : (profit < 0 ? 'error' : 'warning');
    showNotification(`💹 ${result.label}`, message, notifType);
    
    // Réinitialiser
    this.isTrading = false;
    this.currentInvestment = 0;
    this.elements.progressBar.style.width = '0%';
    this.elements.investBtn.disabled = false;
    this.elements.investInput.disabled = false;
    this.elements.investSlider.disabled = false;
    
    // Masquer la barre de progression
    if (this.progressContainer) {
      this.progressContainer.style.display = 'none';
    }
    
    // Mettre à jour l'UI
    this.updateUI();
    updateUI();
    saveGame();
  },
  
  /**
   * Mettre à jour le slider depuis l'input
   */
  updateSliderFromInput(e) {
    const value = parseInt(e.target.value) || 0;
    this.elements.investSlider.value = value;
    this.updatePotentialReturn();
  },
  
  /**
   * Mettre à jour l'input depuis le slider
   */
  updateInputFromSlider(e) {
    const value = parseInt(e.target.value) || 0;
    this.elements.investInput.value = value;
    this.updatePotentialReturn();
  },
  
  /**
   * Mettre à jour le retour potentiel
   */
  updatePotentialReturn() {
    const investment = parseInt(this.elements.investInput.value) || 0;
    const minReturn = Math.floor(investment * 0);
    const maxReturn = Math.floor(investment * 3);
    this.elements.potentialReturn.textContent = `${formatNumber(minReturn)} - ${formatNumber(maxReturn)}`;
  },
  
  /**
   * Mettre à jour l'interface
   */
  updateUI() {
    if (!this.elements.container) return;
    
    this.checkUnlock();
    
    // Mettre à jour les limites
    const maxInvest = Math.min(TRADING_CONFIG.maxInvestment, state.points);
    this.elements.investInput.max = maxInvest;
    this.elements.investSlider.max = maxInvest;
    
    // Valeur courante du marché
    const diff = this.currentValue - 100;
    const diffPercent = diff.toFixed(1);
    const arrow = diff > 0 ? '▲' : (diff < 0 ? '▼' : '━');
    const color = diff > 0 ? TRADING_CONFIG.colors.positive : (diff < 0 ? TRADING_CONFIG.colors.negative : TRADING_CONFIG.colors.neutral);
    
    this.elements.currentValue.innerHTML = `${this.currentValue.toFixed(1)} <span style="color: ${color}">${arrow} ${Math.abs(diffPercent)}%</span>`;
    
    // Montant investi
    if (this.isTrading) {
      this.elements.investedAmount.textContent = formatNumber(this.currentInvestment);
      this.elements.statusText.textContent = '⏳ Trading en cours...';
      this.elements.statusText.style.color = '#3b82f6';
    } else {
      this.elements.investedAmount.textContent = '0';
      this.elements.statusText.textContent = this.isUnlocked ? '✅ Prêt à trader' : '🔒 Verrouillé';
      this.elements.statusText.style.color = this.isUnlocked ? '#10b981' : '#ef4444';
    }
    
    // Bouton
    this.elements.investBtn.disabled = !this.isUnlocked || this.isTrading || state.points < TRADING_CONFIG.minInvestment;
    
    // Retour potentiel
    this.updatePotentialReturn();
  },
  
  /**
   * Afficher le tutoriel du trading
   */
  showTutorial() {
    // Ne pas afficher si déjà vu
    if (localStorage.getItem('nird-trading-tutorial-completed')) {
      return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'tutorial-overlay';
    overlay.innerHTML = `
      <div class="tutorial-container">
        <div class="tutorial-header">
          <div class="tutorial-logo">💹</div>
          <h2 class="tutorial-title">Bienvenue sur le Marché!</h2>
          <p class="tutorial-subtitle">Le Trading est maintenant disponible</p>
        </div>
        
        <div id="tutorial-content">
          <div class="tutorial-steps active">
            <div class="tutorial-step">
              <div class="tutorial-step-icon">🎰</div>
              <h3 class="tutorial-step-title">Investissez pour multiplier vos postes</h3>
              <p class="tutorial-step-text">
                Le <strong>Trading</strong> vous permet d'investir vos postes libérés sur un marché volatile.
                Vous pouvez <span class="highlight">doubler ou tripler</span> votre investissement... 
                ou tout perdre! 🎲
              </p>
              
              <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px; margin: 16px 0;">
                <h4 style="margin: 0 0 12px 0; color: #3b82f6;">📊 Comment ça marche?</h4>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Choisissez le montant à investir (min. 50 postes)</li>
                  <li>Cliquez sur "Investir maintenant"</li>
                  <li>Attendez 15 secondes pendant que le marché évolue</li>
                  <li>Récupérez vos gains... ou vos pertes! 😅</li>
                </ul>
              </div>
              
              <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.3); margin-top: 12px;">
                <strong>⚠️ Attention:</strong> Le trading est risqué!
                <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 0.9em;">
                  <li>30% de chance de <strong>tout perdre</strong></li>
                  <li>45% de chance de <strong>perdre</strong> une partie</li>
                  <li>25% de chance de <strong>gagner</strong> (jusqu'à x3!)</li>
                </ul>
              </div>
              
              <p style="margin-top: 16px; opacity: 0.8; font-size: 0.9em;">
                💡 <strong>Astuce:</strong> N'investissez que ce que vous pouvez vous permettre de perdre.
                La production régulière via la boutique reste plus sûre!
              </p>
            </div>
          </div>
        </div>
        
        <div class="tutorial-buttons">
          <button class="tutorial-btn tutorial-btn-start" onclick="TradingModule.closeTutorial()">
            🚀 Compris, allons trader!
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animation d'apparition
    requestAnimationFrame(() => {
      overlay.classList.add('show');
    });
  },
  
  /**
   * Fermer le tutoriel
   */
  closeTutorial() {
    localStorage.setItem('nird-trading-tutorial-completed', 'true');
    const overlay = document.querySelector('.tutorial-overlay');
    if (overlay) {
      overlay.classList.add('hiding');
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 500);
    }
  }
};
