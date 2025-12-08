/**
 * Trading Configuration
 * NIRD Clicker Game - Système de trading de postes
 */

const TRADING_CONFIG = {
  // Déverrouillage
  unlockRequirement: 500, // Postes nécessaires pour débloquer
  
  // Paramètres du marché
  minInvestment: 50,
  maxInvestment: 10000,
  
  // Volatilité du marché (0-1)
  volatility: 0.15,
  
  // Intervalle de mise à jour du graphique (ms)
  updateInterval: 2000,
  
  // Durée d'un trade (ms)
  tradeDuration: 15000, // 15 secondes
  
  // Multiplicateurs possibles
  multipliers: [
    { value: 0, probability: 0.30, label: "Crash total 💥" },
    { value: 0.5, probability: 0.15, label: "Perte -50% 📉" },
    { value: 0.8, probability: 0.15, label: "Perte -20% 📊" },
    { value: 1, probability: 0.15, label: "Neutre ➖" },
    { value: 1.2, probability: 0.10, label: "Gain +20% 📈" },
    { value: 1.5, probability: 0.08, label: "Gain +50% 🚀" },
    { value: 2, probability: 0.05, label: "Double! 💰" },
    { value: 3, probability: 0.02, label: "Triple!!! 🎰" }
  ],
  
  // Messages
  messages: {
    locked: "🔒 Débloquez le trading en atteignant 500 postes libérés",
    noPoints: "❌ Pas assez de postes pour investir",
    tradingInProgress: "⏳ Un investissement est déjà en cours...",
    marketCrash: "💥 CRASH! Le marché s'est effondré...",
    marketLoss: "📉 Le marché a chuté...",
    marketNeutral: "➖ Le marché est stable",
    marketGain: "📈 Le marché monte!",
    marketBoom: "🚀 BOOM! Le marché explose!"
  },
  
  // Couleurs du graphique
  colors: {
    line: "#3b82f6",
    fill: "rgba(59, 130, 246, 0.2)",
    grid: "rgba(255, 255, 255, 0.1)",
    positive: "#10b981",
    negative: "#ef4444",
    neutral: "#6b7280"
  }
};
