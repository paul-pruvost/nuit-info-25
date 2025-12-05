/**
 * Cheat Commands Module
 * NIRD Clicker Game
 * 
 * Commandes de triche pour les tests.
 * Utiliser dans la console du navigateur (F12).
 */

const cheat = {
  /**
   * Ajouter des points
   * @param {number} amount - Nombre de points à ajouter
   */
  addPoints: function(amount = 10000) {
    state.points += amount;
    state.totalPointsEarned += amount;
    updateUI();
    console.log(`✅ +${formatNumber(amount)} points ajoutés`);
  },
  
  /**
   * Définir les points par seconde
   * @param {number} pps - Points par seconde
   */
  setPPS: function(pps = 100) {
    state.pointsPerSecond = pps;
    updateUI();
    console.log(`✅ Production définie à ${pps}/s`);
  },
  
  /**
   * Déclencher un événement aléatoire
   */
  triggerEvent: function() {
    if (blackoutActive) {
      console.log("❌ Impossible pendant une panne de courant");
      return;
    }
    removeEvent(); // Supprimer l'événement actuel s'il y en a un
    spawnRandomEvent();
    console.log("✅ Événement aléatoire déclenché");
  },
  
  /**
   * Déclencher un quiz
   */
  triggerQuiz: function() {
    if (blackoutActive) {
      console.log("❌ Impossible pendant une panne de courant");
      return;
    }
    removeEvent();
    openQuiz();
    console.log("✅ Quiz déclenché");
  },
  
  /**
   * Déclencher une panne de courant
   */
  triggerBlackout: function() {
    if (blackoutActive) {
      console.log("❌ Une panne est déjà en cours");
      return;
    }
    if (quizActive || bsodActive) {
      console.log("❌ Impossible pendant un quiz ou BSOD");
      return;
    }
    removeEvent();
    startBlackout();
    console.log("✅ Panne de courant déclenchée");
  },
  
  /**
   * Déclencher un Blue Screen Wordle
   */
  triggerBsod: function() {
    if (bsodActive) {
      console.log("❌ Un BSOD est déjà en cours");
      return;
    }
    if (quizActive || blackoutActive) {
      console.log("❌ Impossible pendant un quiz ou une panne");
      return;
    }
    removeEvent();
    startBsod();
    console.log("✅ Blue Screen Wordle déclenché");
  },
  
  /**
   * Terminer la panne de courant
   */
  endBlackout: function() {
    if (!blackoutActive) {
      console.log("❌ Aucune panne en cours");
      return;
    }
    endBlackout();
    console.log("✅ Panne terminée");
  },
  
  /**
   * Révéler la position du routeur (pendant une panne)
   */
  revealRouter: function() {
    if (!blackoutActive || !routerElement) {
      console.log("❌ Aucune panne en cours ou routeur non spawné");
      return;
    }
    const rect = routerElement.getBoundingClientRect();
    console.log(`📡 Routeur à la position: X=${Math.round(rect.left)}, Y=${Math.round(rect.top)}`);
    // Flash temporaire
    routerElement.style.opacity = "1";
    setTimeout(() => {
      if (routerElement) routerElement.style.opacity = "0";
    }, 500);
  },
  
  /**
   * Faire évoluer l'ordinateur au niveau suivant
   */
  evolveComputer: function() {
    const currentLevel = getComputerLevel(state);
    const thresholds = [0, 5, 25, 100, 500, 1000, 2000, 5000, 10000];
    if (currentLevel < 8) {
      state.pointsPerSecond = thresholds[currentLevel + 1];
      updateUI();
      console.log(`✅ Ordinateur évolué au niveau ${currentLevel + 1}`);
    } else {
      console.log("❌ Niveau maximum atteint");
    }
  },
  
  /**
   * Débloquer tous les défis
   */
  unlockAllChallenges: function() {
    state.challenges.forEach(c => {
      if (!c.unlocked) {
        c.unlocked = true;
        if (c.reward.type === "clickMultiplier") {
          state.clickMultiplier *= c.reward.value;
        } else if (c.reward.type === "productionMultiplier") {
          state.productionMultiplier *= c.reward.value;
        }
      }
    });
    recalcPPS();
    updateUI();
    console.log("✅ Tous les défis débloqués");
  },
  
  /**
   * Acheter 10 de chaque amélioration
   */
  buyAll: function(count = 10) {
    state.upgrades.forEach(u => {
      u.count += count;
    });
    recalcPPS();
    updateUI();
    console.log(`✅ +${count} de chaque amélioration`);
  },
  
  /**
   * Débloquer une lettre NIRD
   * @param {number} index - Index de la lettre (0-3)
   */
  unlockNird: function(index = -1) {
    if (index === -1) {
      // Débloquer la prochaine lettre non débloquée
      index = state.nirdUnlocked.findIndex(u => !u);
      if (index === -1) {
        console.log("❌ Toutes les lettres sont déjà débloquées");
        return;
      }
    }
    if (index < 0 || index > 3) {
      console.log("❌ Index invalide (0-3)");
      return;
    }
    if (state.nirdUnlocked[index]) {
      console.log(`❌ La lettre ${NIRD_CONFIG.letters[index].letter} est déjà débloquée`);
      return;
    }
    NirdModule.revealLetter(index);
    NirdModule.renderSlots();
    NirdModule.updateUI();
    console.log(`✅ Lettre "${NIRD_CONFIG.letters[index].letter}" débloquée`);
  },
  
  /**
   * Débloquer toutes les lettres NIRD
   */
  unlockAllNird: function() {
    state.nirdUnlocked = [true, true, true, true];
    NirdModule.renderSlots();
    NirdModule.updateUI();
    saveGame();
    console.log("✅ Toutes les lettres NIRD débloquées");
  },
  
  /**
   * Réinitialiser les lettres NIRD
   */
  resetNird: function() {
    state.nirdUnlocked = [false, false, false, false];
    NirdModule.renderSlots();
    NirdModule.updateUI();
    saveGame();
    console.log("✅ Lettres NIRD réinitialisées");
  },
  
  /**
   * Réafficher le tutoriel
   */
  showTutorial: function() {
    TutorialModule.reset();
    TutorialModule.currentStep = 0;
    localStorage.removeItem('nird-tutorial-completed');
    TutorialModule.createOverlay();
    TutorialModule.renderStep();
    requestAnimationFrame(() => {
      TutorialModule.overlay.classList.add('show');
    });
    console.log("✅ Tutoriel affiché");
  },
  
  /**
   * Afficher l'aide des commandes
   */
  help: function() {
    console.log(`
🎮 NIRD Clicker - Commandes Cheat
================================
cheat.addPoints(n)      - Ajouter n points (défaut: 10000)
cheat.setPPS(n)         - Définir la production à n/s
cheat.triggerEvent()    - Déclencher un événement aléatoire
cheat.triggerQuiz()     - Déclencher un quiz
cheat.triggerBlackout() - Déclencher une panne de courant
cheat.triggerBsod()     - Déclencher un Blue Screen Wordle
cheat.endBlackout()     - Terminer la panne
cheat.revealRouter()    - Révéler la position du routeur
cheat.evolveComputer()  - Évoluer l'ordinateur
cheat.unlockAllChallenges() - Débloquer tous les défis
cheat.buyAll(n)         - Acheter n de chaque amélioration
cheat.unlockNird(i)     - Débloquer lettre NIRD (0-3) ou suivante
cheat.unlockAllNird()   - Débloquer toutes les lettres NIRD
cheat.resetNird()       - Réinitialiser les lettres NIRD
cheat.showTutorial()    - Réafficher le tutoriel d'intro
cheat.help()            - Afficher cette aide
    `);
  }
};

// Message d'accueil dans la console
console.log("🎮 Commandes cheat disponibles ! Tapez cheat.help() pour la liste.");
