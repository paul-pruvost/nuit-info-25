/**
 * Game State Management
 * NIRD Clicker Game
 */

const state = {
  points: 0,
  pointsPerSecond: 0,
  basePointsPerSecond: 0, // PPS sans multiplicateur (pour l'évolution de l'ordi)
  totalPointsEarned: 0,
  totalClicks: 0,
  pointsPerClick: 1,
  clickMultiplier: 1,
  productionMultiplier: 1,
  eventsClicked: 0,
  nirdUnlocked: [false, false, false, false], // Lettres NIRD débloquées
  upgrades: UPGRADES_CONFIG.map(u => ({ ...u })),
  challenges: CHALLENGES_CONFIG.map(c => ({ ...c })),
  eventTypes: EVENTS_CONFIG,
  quizQuestions: QUIZ_CONFIG
};
