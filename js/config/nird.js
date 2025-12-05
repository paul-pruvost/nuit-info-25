/**
 * NIRD Acronym Configuration
 * Objectif global : décrypter les 4 lettres de l'acronyme NIRD
 */

const NIRD_CONFIG = {
  letters: [
    {
      letter: "N",
      word: "Numérique",
      description: "Le numérique englobe l'ensemble des technologies de l'information et de la communication. Il transforme notre société, nos modes de travail et nos interactions quotidiennes.",
      icon: "💻"
    },
    {
      letter: "I",
      word: "Inclusif",
      description: "L'inclusivité numérique vise à garantir que tous les citoyens, quels que soient leur âge, leur handicap ou leur situation sociale, puissent accéder aux outils numériques et les utiliser.",
      icon: "🤝"
    },
    {
      letter: "R",
      word: "Responsable",
      description: "Le numérique responsable implique de réduire l'impact environnemental des technologies, de respecter l'éthique et de promouvoir des usages durables et raisonnés.",
      icon: "🌱"
    },
    {
      letter: "D",
      word: "Durable",
      description: "La durabilité numérique consiste à concevoir des technologies qui préservent les ressources, favorisent la réparabilité et minimisent les déchets électroniques.",
      icon: "♻️"
    }
  ],
  
  // Coût de base pour une tentative (en points)
  baseCost: 100,
  
  // Multiplicateur de coût par lettre déjà débloquée
  costMultiplier: 5,
  
  // Probabilité de base (en %) pour 100 points dépensés
  baseSuccessRate: 5,
  
  // Probabilité max (en %)
  maxSuccessRate: 80,
  
  // Points nécessaires pour atteindre la probabilité max
  pointsForMaxRate: 10000,
  
  // Durée de l'animation casino (en ms)
  animationDuration: 3000,
  
  // Intervalle entre chaque changement de lettre pendant l'animation (en ms)
  animationInterval: 50
};
