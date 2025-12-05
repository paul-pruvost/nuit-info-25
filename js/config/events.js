/**
 * Random Events Configuration
 * NIRD Clicker Game
 */

const EVENTS_CONFIG = [
  {
    id: "flying-tux",
    icon: "🐧",
    name: "Tux volant",
    message: "Un pingouin passe ! Clique vite !",
    getReward: (s) => ({ type: "points", value: Math.max(50, Math.floor(s.pointsPerSecond * 5)) })
  },
  {
    id: "helper",
    icon: "👨‍💻",
    name: "Développeur libre",
    message: "Un développeur veut t'aider !",
    getReward: (s) => ({ type: "points", value: Math.max(100, Math.floor(s.pointsPerSecond * 10)) })
  },
  {
    id: "golden-cd",
    icon: "💿",
    name: "CD doré Linux",
    message: "Un CD d'installation magique apparaît !",
    getReward: (s) => ({ type: "tempBoost", value: 2, duration: 10 })
  },
  {
    id: "student",
    icon: "🧑‍🎓",
    name: "Étudiant motivé",
    message: "Un étudiant veut apprendre !",
    getReward: (s) => ({ type: "points", value: Math.max(75, Math.floor(s.pointsPerSecond * 7)) })
  },
  {
    id: "recycle",
    icon: "♻️",
    name: "Recyclage bonus",
    message: "Du matériel à recycler !",
    getReward: (s) => ({ type: "points", value: Math.max(60, Math.floor(s.pointsPerSecond * 6)) })
  },
  {
    id: "lightning",
    icon: "⚡",
    name: "Boost d'énergie",
    message: "Énergie renouvelable gratuite !",
    getReward: (s) => ({ type: "tempBoost", value: 3, duration: 5 })
  },
  {
    id: "teacher",
    icon: "👩‍🏫",
    name: "Prof enthousiaste",
    message: "Une enseignante veut former ses collègues !",
    getReward: (s) => ({ type: "points", value: Math.max(80, Math.floor(s.pointsPerSecond * 8)) })
  },
  {
    id: "community",
    icon: "🤝",
    name: "Communauté solidaire",
    message: "La communauté se mobilise !",
    getReward: (s) => ({ type: "tempBoost", value: 2.5, duration: 8 })
  },
  {
    id: "quiz",
    icon: "❓",
    name: "Quiz NIRD",
    message: "Teste tes connaissances !",
    isQuiz: true,
    getReward: (s) => ({ type: "points", value: Math.max(200, Math.floor(s.pointsPerSecond * 15)) })
  }
];
