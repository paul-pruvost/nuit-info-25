/**
 * Blue Screen Wordle Configuration
 * NIRD Clicker Game
 * 
 * Liste des mots NIRD pour le jeu Wordle
 */

const BSOD_WORDS_CONFIG = [
  // Mots liés au Numérique Inclusif, Responsable et Durable
  { word: "LIBRE", hint: "Logiciel ___" },
  { word: "LINUX", hint: "Système d'exploitation libre" },
  { word: "EQUIT", hint: "Numérique ___able" },
  { word: "REPAR", hint: "___ation de matériel" },
  { word: "USAGE", hint: "Réemploi et second ___" },
  { word: "ACCES", hint: "___sibilité numérique" },
  { word: "FORMA", hint: "___tion aux outils" },
  { word: "SOLID", hint: "___arité numérique" },
  { word: "INCLU", hint: "___sion numérique" },
  { word: "OUVER", hint: "Open source = code ___t" },
  { word: "PARTA", hint: "___ge des connaissances" },
  { word: "ETHIQ", hint: "Numérique ___ue" },
  { word: "LOCAL", hint: "Circuits courts et ___" },
  { word: "SOBRE", hint: "Numérique ___" }
];

/**
 * Texte du Blue Screen NIRD avec {WORD} comme placeholder
 */
const BSOD_TEXT = `Une erreur critique a été détectée.
ERREUR_LOGICIEL_PROPRIETAIRE

Le système a détecté une violation des principes NIRD.
Retrouve le mot {WORD} pour réparer le système.

*** STOP: 0xNIRD2025 ***`;
