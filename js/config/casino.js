/**
 * Casino Configuration
 * NIRD Clicker Game - Mini-jeux de casino
 */

const CASINO_CONFIG = {
  // Déverrouillage
  unlockRequirement: 1000, // Postes nécessaires pour débloquer
  
  // Paramètres généraux
  minBet: 10,
  maxBet: 5000,
  
  // 🎰 Machine à sous NIRD
  slots: {
    name: "Machine à sous NIRD",
    icon: "🎰",
    description: "Aligne 3 symboles NIRD pour gagner gros!",
    symbols: [
      { char: "🐧", name: "Tux", multiplier: 5 },
      { char: "♻️", name: "Recyclage", multiplier: 4 },
      { char: "🔓", name: "Libre", multiplier: 3 },
      { char: "🌱", name: "Durable", multiplier: 2 },
      { char: "💚", name: "Éthique", multiplier: 1.5 },
      { char: "⚡", name: "Énergie", multiplier: 1 }
    ],
    jackpotMultiplier: 100, // Si 3 Tux alignés
    spinDuration: 2000 // ms
  },
  
  // 🎲 Dés du NIRD
  dice: {
    name: "Dés du NIRD",
    icon: "🎲",
    description: "Lance 2 dés. 7 ou 11 = x2, doubles = x3, 2 ou 12 = x5!",
    payouts: {
      7: 2,    // Le plus probable
      11: 2,   // Assez probable
      doubles: 3, // Même nombre sur les 2 dés
      2: 5,    // Snake eyes
      12: 5    // Boxcars
    }
  },
  
  // 🃏 Blackjack NIRD
  blackjack: {
    name: "Blackjack NIRD",
    icon: "🃏",
    description: "Approche-toi de 21 sans dépasser. Bats le croupier!",
    dealerStandsOn: 17,
    blackjackMultiplier: 2.5,
    winMultiplier: 2,
    pushMultiplier: 1 // Égalité
  },
  
  // 🎯 Roue de la Fortune NIRD
  wheel: {
    name: "Roue de la Fortune",
    icon: "🎯",
    description: "Fais tourner la roue et tente ta chance!",
    segments: [
      { label: "Jackpot!", multiplier: 10, probability: 0.05, color: "#ef4444" },
      { label: "x5", multiplier: 5, probability: 0.10, color: "#f59e0b" },
      { label: "x3", multiplier: 3, probability: 0.15, color: "#10b981" },
      { label: "x2", multiplier: 2, probability: 0.20, color: "#3b82f6" },
      { label: "x1.5", multiplier: 1.5, probability: 0.20, color: "#6366f1" },
      { label: "Perdu", multiplier: 0, probability: 0.30, color: "#6b7280" }
    ],
    spinDuration: 3000
  },
  
  // Messages
  messages: {
    locked: "🔒 Débloquez le casino en atteignant 1000 postes libérés",
    noBet: "❌ Placez une mise valide",
    noPoints: "❌ Pas assez de postes",
    win: "🎉 Vous avez gagné!",
    lose: "😢 Vous avez perdu...",
    jackpot: "💰 JACKPOT! Incroyable!",
    push: "🤝 Égalité!"
  }
};
