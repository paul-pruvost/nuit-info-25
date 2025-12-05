/**
 * Tutorial Module
 * NIRD Clicker Game - Introduction Tutorial
 */

const TutorialModule = {
  currentStep: 0,
  totalSteps: 4,
  overlay: null,
  
  steps: [
    {
      icon: "🏰",
      title: "Bienvenue dans le Village Numérique !",
      text: `Tu es aux commandes d'un établissement qui veut <strong>se libérer des géants du numérique</strong>. 
             Ta mission : construire un écosystème numérique <span class="highlight">libre, éthique et durable</span>.`
    },
    {
      icon: "🖱️",
      title: "Clique pour agir !",
      text: `Clique sur l'<strong>ordinateur</strong> pour <strong>libérer des postes</strong>. 
             Chaque clic représente une action concrète : installation de Linux, sensibilisation, réparation...
             Plus tu cliques, plus tu accumules de ressources !`
    },
    {
      icon: "🛒",
      title: "Investis dans des actions durables",
      text: `Utilise tes postes libérés pour acheter des <strong>actions dans la boutique</strong> : 
             ateliers réemploi, formations, FabLabs... 
             Ces actions produisent des postes <strong>automatiquement</strong> chaque seconde.`
    },
    {
      icon: "🔐",
      title: "Déchiffre le mystère NIRD",
      text: `En bas de l'écran, un <strong>acronyme mystérieux</strong> attend d'être déchiffré : <span class="highlight">N I R D</span>.
             Investis des postes pour tenter de révéler chaque lettre. 
             Plus tu investis, plus tu as de chances de réussir !
             Découvre ce qui se cache derrière ce mot...`,
      showNirdPreview: true
    }
  ],
  
  /**
   * Vérifie si le tutoriel doit être affiché
   */
  shouldShow() {
    return !localStorage.getItem('nird-tutorial-completed');
  },
  
  /**
   * Initialise et affiche le tutoriel
   */
  init() {
    if (!this.shouldShow()) return;
    
    this.createOverlay();
    this.renderStep();
    
    // Afficher avec animation
    requestAnimationFrame(() => {
      this.overlay.classList.add('show');
    });
  },
  
  /**
   * Crée l'overlay du tutoriel
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'tutorial-overlay';
    this.overlay.innerHTML = `
      <div class="tutorial-container">
        <div class="tutorial-header">
          <div class="tutorial-logo">🐧</div>
          <h2 class="tutorial-title">NIRD Clicker</h2>
          <p class="tutorial-subtitle">Construis ton village numérique résistant</p>
        </div>
        
        <div id="tutorial-content"></div>
        
        <div class="tutorial-progress">
          ${Array(this.totalSteps).fill(0).map((_, i) => 
            `<div class="tutorial-dot" data-step="${i}"></div>`
          ).join('')}
        </div>
        
        <div class="tutorial-buttons">
          <button class="tutorial-btn tutorial-btn-skip" onclick="TutorialModule.skip()">Passer</button>
          <button class="tutorial-btn tutorial-btn-next" id="tutorial-next-btn" onclick="TutorialModule.next()">Suivant →</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
  },
  
  /**
   * Affiche l'étape actuelle
   */
  renderStep() {
    const step = this.steps[this.currentStep];
    const content = document.getElementById('tutorial-content');
    const nextBtn = document.getElementById('tutorial-next-btn');
    
    // Mettre à jour les dots
    document.querySelectorAll('.tutorial-dot').forEach((dot, i) => {
      dot.classList.remove('active', 'completed');
      if (i < this.currentStep) dot.classList.add('completed');
      if (i === this.currentStep) dot.classList.add('active');
    });
    
    // Contenu de l'étape
    let extraContent = '';
    if (step.showNirdPreview) {
      extraContent = `
        <div class="tutorial-nird-preview">
          <div class="tutorial-nird-letter">?</div>
          <div class="tutorial-nird-letter">?</div>
          <div class="tutorial-nird-letter">?</div>
          <div class="tutorial-nird-letter">?</div>
        </div>
      `;
    }
    
    content.innerHTML = `
      <div class="tutorial-steps active">
        <div class="tutorial-step">
          <div class="tutorial-step-icon">${step.icon}</div>
          <h3 class="tutorial-step-title">${step.title}</h3>
          ${extraContent}
          <p class="tutorial-step-text">${step.text}</p>
        </div>
      </div>
    `;
    
    // Animation des lettres NIRD
    if (step.showNirdPreview) {
      setTimeout(() => this.animateNirdPreview(), 500);
    }
    
    // Bouton final
    if (this.currentStep === this.totalSteps - 1) {
      nextBtn.textContent = "🚀 Commencer !";
      nextBtn.className = "tutorial-btn tutorial-btn-start";
      nextBtn.onclick = () => this.complete();
    } else {
      nextBtn.textContent = "Suivant →";
      nextBtn.className = "tutorial-btn tutorial-btn-next";
      nextBtn.onclick = () => this.next();
    }
  },
  
  /**
   * Animation de preview des lettres NIRD
   */
  animateNirdPreview() {
    const letters = document.querySelectorAll('.tutorial-nird-letter');
    const nirdLetters = ['N', 'I', 'R', 'D'];
    
    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.textContent = nirdLetters[i];
        letter.classList.add('revealed');
      }, i * 400);
    });
  },
  
  /**
   * Passe à l'étape suivante
   */
  next() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.renderStep();
    }
  },
  
  /**
   * Passer le tutoriel
   */
  skip() {
    this.complete();
  },
  
  /**
   * Termine le tutoriel
   */
  complete() {
    localStorage.setItem('nird-tutorial-completed', 'true');
    
    this.overlay.classList.add('hiding');
    this.overlay.classList.remove('show');
    
    setTimeout(() => {
      this.overlay.remove();
    }, 500);
  },
  
  /**
   * Réinitialise le tutoriel (pour les tests)
   */
  reset() {
    localStorage.removeItem('nird-tutorial-completed');
    console.log("✅ Tutoriel réinitialisé. Recharge la page pour le revoir.");
  }
};
