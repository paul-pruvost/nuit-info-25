/**
 * Challenges Configuration
 * NIRD Clicker Game
 */

const CHALLENGES_CONFIG = [
  {
    id: "first-click",
    name: "Premier pas",
    icon: "👆",
    desc: "Clique pour la première fois",
    condition: (s) => s.totalClicks >= 1,
    reward: { type: "click", value: 1, desc: "+1 poste/clic" },
    completed: false
  },
  {
    id: "click-100",
    name: "Cliqueur assidu",
    icon: "🖱️",
    desc: "Clique 100 fois",
    condition: (s) => s.totalClicks >= 100,
    reward: { type: "click", value: 2, desc: "+2 postes/clic" },
    completed: false
  },
  {
    id: "click-1000",
    name: "Cliqueur fou",
    icon: "⚡",
    desc: "Clique 1000 fois",
    condition: (s) => s.totalClicks >= 1000,
    reward: { type: "click", value: 5, desc: "+5 postes/clic" },
    completed: false
  },
  {
    id: "first-upgrade",
    name: "Première action",
    icon: "🌟",
    desc: "Achète ta première action NIRD",
    condition: (s) => s.upgrades.some(u => u.count > 0),
    reward: { type: "points", value: 50, desc: "+50 postes" },
    completed: false
  },
  {
    id: "all-upgrades",
    name: "Diversification",
    icon: "🎯",
    desc: "Possède au moins une de chaque action",
    condition: (s) => s.upgrades.every(u => u.count > 0),
    reward: { type: "productionMult", value: 0.1, desc: "+10% production" },
    completed: false
  },
  {
    id: "points-1000",
    name: "Millier libéré",
    icon: "🏅",
    desc: "Accumule 1 000 postes libérés au total",
    condition: (s) => s.totalPointsEarned >= 1000,
    reward: { type: "click", value: 1, desc: "+1 poste/clic" },
    completed: false
  },
  {
    id: "points-100000",
    name: "Cent mille libertés",
    icon: "🏆",
    desc: "Accumule 100 000 postes libérés au total",
    condition: (s) => s.totalPointsEarned >= 100000,
    reward: { type: "clickMult", value: 0.25, desc: "+25% clics" },
    completed: false
  },
  {
    id: "points-1m",
    name: "Millionnaire libre",
    icon: "💎",
    desc: "Accumule 1 million de postes libérés au total",
    condition: (s) => s.totalPointsEarned >= 1000000,
    reward: { type: "productionMult", value: 0.25, desc: "+25% production" },
    completed: false
  },
  {
    id: "pps-10",
    name: "Automatisation",
    icon: "⚙️",
    desc: "Atteins 10 postes/seconde",
    condition: (s) => s.pointsPerSecond >= 10,
    reward: { type: "points", value: 100, desc: "+100 postes" },
    completed: false
  },
  {
    id: "pps-100",
    name: "Usine à liberté",
    icon: "🏭",
    desc: "Atteins 100 postes/seconde",
    condition: (s) => s.pointsPerSecond >= 100,
    reward: { type: "points", value: 1000, desc: "+1000 postes" },
    completed: false
  },
  {
    id: "pps-1000",
    name: "Révolution numérique",
    icon: "🚀",
    desc: "Atteins 1000 postes/seconde",
    condition: (s) => s.pointsPerSecond >= 1000,
    reward: { type: "productionMult", value: 0.15, desc: "+15% production" },
    completed: false
  },
  {
    id: "linux-10",
    name: "Pingouin power",
    icon: "🐧",
    desc: "Migre 10 postes vers Linux",
    condition: (s) => s.upgrades.find(u => u.id === "linux-post")?.count >= 10,
    reward: { type: "click", value: 3, desc: "+3 postes/clic" },
    completed: false
  },
  {
    id: "fablab-owner",
    name: "Maker",
    icon: "🛠️",
    desc: "Ouvre ton premier FabLab solidaire",
    condition: (s) => s.upgrades.find(u => u.id === "fablab")?.count >= 1,
    reward: { type: "points", value: 5000, desc: "+5000 postes" },
    completed: false
  },
  {
    id: "universite-owner",
    name: "Académicien du libre",
    icon: "🎓",
    desc: "Fonde une Université du Libre",
    condition: (s) => s.upgrades.find(u => u.id === "universite-libre")?.count >= 1,
    reward: { type: "clickMult", value: 0.5, desc: "+50% clics" },
    completed: false
  },
  {
    id: "events-5",
    name: "Opportuniste",
    icon: "🎪",
    desc: "Clique sur 5 événements spéciaux",
    condition: (s) => s.eventsClicked >= 5,
    reward: { type: "click", value: 2, desc: "+2 postes/clic" },
    completed: false
  },
  {
    id: "events-25",
    name: "Chasseur d'événements",
    icon: "🎯",
    desc: "Clique sur 25 événements spéciaux",
    condition: (s) => s.eventsClicked >= 25,
    reward: { type: "productionMult", value: 0.2, desc: "+20% production" },
    completed: false
  },
  // Nouveaux défis
  {
    id: "click-10000",
    name: "Cliqueur légendaire",
    icon: "💫",
    desc: "Clique 10 000 fois",
    condition: (s) => s.totalClicks >= 10000,
    reward: { type: "click", value: 10, desc: "+10 postes/clic" },
    completed: false
  },
  {
    id: "click-100000",
    name: "Doigts en feu",
    icon: "🔥",
    desc: "Clique 100 000 fois",
    condition: (s) => s.totalClicks >= 100000,
    reward: { type: "clickMult", value: 1.0, desc: "+100% clics" },
    completed: false
  },
  {
    id: "points-10m",
    name: "Dix millions de libertés",
    icon: "💰",
    desc: "Accumule 10 millions de postes libérés",
    condition: (s) => s.totalPointsEarned >= 10000000,
    reward: { type: "productionMult", value: 0.5, desc: "+50% production" },
    completed: false
  },
  {
    id: "points-100m",
    name: "Cent millions",
    icon: "👑",
    desc: "Accumule 100 millions de postes libérés",
    condition: (s) => s.totalPointsEarned >= 100000000,
    reward: { type: "clickMult", value: 0.75, desc: "+75% clics" },
    completed: false
  },
  {
    id: "points-1b",
    name: "Milliardaire du libre",
    icon: "🌟",
    desc: "Accumule 1 milliard de postes libérés",
    condition: (s) => s.totalPointsEarned >= 1000000000,
    reward: { type: "productionMult", value: 1.0, desc: "+100% production" },
    completed: false
  },
  {
    id: "pps-10000",
    name: "Tsunami numérique",
    icon: "🌊",
    desc: "Atteins 10 000 postes/seconde",
    condition: (s) => s.pointsPerSecond >= 10000,
    reward: { type: "points", value: 50000, desc: "+50 000 postes" },
    completed: false
  },
  {
    id: "pps-100000",
    name: "Supernova libre",
    icon: "✨",
    desc: "Atteins 100 000 postes/seconde",
    condition: (s) => s.pointsPerSecond >= 100000,
    reward: { type: "productionMult", value: 0.3, desc: "+30% production" },
    completed: false
  },
  {
    id: "pps-1m",
    name: "Big Bang du Libre",
    icon: "💥",
    desc: "Atteins 1 million de postes/seconde",
    condition: (s) => s.pointsPerSecond >= 1000000,
    reward: { type: "clickMult", value: 1.0, desc: "+100% clics" },
    completed: false
  },
  {
    id: "linux-50",
    name: "Armée de pingouins",
    icon: "🐧",
    desc: "Migre 50 postes vers Linux",
    condition: (s) => s.upgrades.find(u => u.id === "linux-post")?.count >= 50,
    reward: { type: "productionMult", value: 0.15, desc: "+15% production" },
    completed: false
  },
  {
    id: "linux-100",
    name: "Empereur pingouin",
    icon: "🐧",
    desc: "Migre 100 postes vers Linux",
    condition: (s) => s.upgrades.find(u => u.id === "linux-post")?.count >= 100,
    reward: { type: "click", value: 15, desc: "+15 postes/clic" },
    completed: false
  },
  {
    id: "repair-cafe-owner",
    name: "Réparateur en chef",
    icon: "🔧",
    desc: "Ouvre ton premier Repair Café",
    condition: (s) => s.upgrades.find(u => u.id === "repair-cafe")?.count >= 1,
    reward: { type: "points", value: 100000, desc: "+100 000 postes" },
    completed: false
  },
  {
    id: "chatons-owner",
    name: "Ami des chatons",
    icon: "🐱",
    desc: "Rejoins le collectif CHATONS",
    condition: (s) => s.upgrades.find(u => u.id === "chatons")?.count >= 1,
    reward: { type: "productionMult", value: 0.25, desc: "+25% production" },
    completed: false
  },
  {
    id: "ministere-owner",
    name: "Révolutionnaire",
    icon: "🏰",
    desc: "Crée le Ministère du Libre",
    condition: (s) => s.upgrades.find(u => u.id === "ministere-libre")?.count >= 1,
    reward: { type: "productionMult", value: 1.0, desc: "+100% production" },
    completed: false
  },
  {
    id: "all-tier1",
    name: "Collection complète",
    icon: "📦",
    desc: "Possède 10 de chaque action de base",
    condition: (s) => {
      const tier1 = ["linux-post", "reemploi", "forge", "club", "collectivite", "datacenter-vert", "formation-profs", "fablab", "reseau-ecoles", "universite-libre"];
      return tier1.every(id => s.upgrades.find(u => u.id === id)?.count >= 10);
    },
    reward: { type: "clickMult", value: 0.5, desc: "+50% clics" },
    completed: false
  },
  {
    id: "events-50",
    name: "Maître des événements",
    icon: "🎪",
    desc: "Clique sur 50 événements spéciaux",
    condition: (s) => s.eventsClicked >= 50,
    reward: { type: "click", value: 5, desc: "+5 postes/clic" },
    completed: false
  },
  {
    id: "events-100",
    name: "Légende événementielle",
    icon: "🏆",
    desc: "Clique sur 100 événements spéciaux",
    condition: (s) => s.eventsClicked >= 100,
    reward: { type: "productionMult", value: 0.5, desc: "+50% production" },
    completed: false
  },
  {
    id: "speed-demon",
    name: "Vitesse lumière",
    icon: "⚡",
    desc: "Atteins 50 millions de postes/seconde",
    condition: (s) => s.pointsPerSecond >= 50000000,
    reward: { type: "clickMult", value: 2.0, desc: "+200% clics" },
    completed: false
  },
  {
    id: "eco-warrior",
    name: "Guerrier écologique",
    icon: "🌍",
    desc: "Possède un Low-Tech Lab et un Serveur Solaire",
    condition: (s) => {
      return s.upgrades.find(u => u.id === "low-tech-lab")?.count >= 1 &&
             s.upgrades.find(u => u.id === "serveur-solaire")?.count >= 1;
    },
    reward: { type: "productionMult", value: 0.2, desc: "+20% production" },
    completed: false
  },
  {
    id: "network-master",
    name: "Maître du réseau",
    icon: "📡",
    desc: "Possède 5 Réseaux Mesh Citoyens",
    condition: (s) => s.upgrades.find(u => u.id === "reseau-mesh")?.count >= 5,
    reward: { type: "productionMult", value: 0.75, desc: "+75% production" },
    completed: false
  },
  {
    id: "recycler-pro",
    name: "Pro du recyclage",
    icon: "♻️",
    desc: "Possède 10 Usines de Reconditionnement",
    condition: (s) => s.upgrades.find(u => u.id === "recond-usine")?.count >= 10,
    reward: { type: "click", value: 50, desc: "+50 postes/clic" },
    completed: false
  }
];
