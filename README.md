```
QUENTIN CLEMONT FAN CLUB PRO MAX

Paul PRUVOST
Valentin CROGIEZ
Léo GIARDINELLI
Dylan LEMAIRE
```

test

[lien du dépôt](https://github.com/paul-pruvost/nuit-info-25)

# NIRD Clicker - Village Numérique Résistant

Un jeu clicker éducatif sur le Numérique Inclusif, Responsable et Durable.

## Concept du jeu

Tu es aux commandes d'un établissement qui veut se libérer des géants du numérique. Ta mission : construire un écosystème numérique libre, éthique et durable en cliquant pour libérer des postes informatiques et en investissant dans des actions NIRD.

## Comment jouer

### Les bases

1. Clique sur l'ordinateur pour générer des "postes libérés"
2. Achète des actions dans la boutique pour automatiser ta production
3. Complète des défis pour obtenir des bonus permanents
4. Déchiffre l'acronyme NIRD en investissant tes postes

### L'objectif principal : Déchiffrer NIRD

En bas de l'écran, 4 lettres mystérieuses attendent d'être révélées. Investis des postes pour tenter de les déchiffrer. Plus tu investis, plus tu as de chances de réussir. Chaque lettre débloquée révèle un concept du numérique responsable.

## Boutique

### Actions de base

| Action               | Coût initial | Production |
| -------------------- | ------------ | ---------- |
| Migration Linux      | 10           | 0.2/s      |
| Atelier réemploi     | 60           | 1/s        |
| Forge logicielle     | 200          | 4/s        |
| Club numérique       | 600          | 10/s       |
| Collectivité engagée | 1 800        | 25/s       |
| Datacenter vert      | 5 000        | 60/s       |
| Formation profs      | 15 000       | 150/s      |
| FabLab solidaire     | 45 000       | 400/s      |
| Réseau d'écoles      | 120 000      | 1 000/s    |
| Université du Libre  | 350 000      | 2 500/s    |

### Actions avancées

| Action                     | Coût initial | Production |
| -------------------------- | ------------ | ---------- |
| Repair Café                | 900K         | 6 000/s    |
| Low-Tech Lab               | 2.5M         | 15 000/s   |
| Serveur Solaire            | 7M           | 40 000/s   |
| Collectif CHATONS          | 20M          | 100 000/s  |
| Association Libriste       | 55M          | 250 000/s  |
| Antenne Wikipédia          | 150M         | 650 000/s  |
| Usine de Reconditionnement | 400M         | 1.6M/s     |
| Fonderie Open Hardware     | 1B           | 4M/s       |
| Réseau Mesh Citoyen        | 2.5B         | 10M/s      |
| Ministère du Libre         | 10B          | 50M/s      |

## Défis

Complète des défis pour obtenir des bonus permanents :

- **Clics** : Premier pas, Cliqueur assidu, Cliqueur fou, Cliqueur légendaire...
- **Production** : Automatisation, Usine à liberté, Révolution numérique...
- **Points totaux** : Millier libéré, Cent mille libertés, Millionnaire libre...
- **Actions spécifiques** : Pingouin power, Maker, Ami des chatons...
- **Événements** : Opportuniste, Chasseur d'événements, Maître des événements...

## Événements spéciaux

Des événements aléatoires apparaissent pendant le jeu.

### Bonus cliquables

Des bonus apparaissent à l'écran et offrent des postes gratuits si tu cliques dessus à temps :

- Don anonyme (+500 postes)
- Subvention européenne (+2 000 postes)
- Partenariat associatif (+5 000 postes)
- Mécénat tech éthique (+15 000 postes)

### Quiz éducatif

Réponds à des questions sur le numérique responsable pour gagner des bonus de production temporaires.

### Panne de courant

L'écran devient noir. Utilise ta souris comme une lampe torche pour trouver le routeur et rétablir le courant.

### Blue Screen Wordle

Un écran bleu de la mort apparaît. Devine le mot en 4 tentatives (style Wordle) pour rétablir le système. Les mots sont liés au thème NIRD.

## Évolution de l'ordinateur

Ton ordinateur évolue visuellement en fonction de ta production par seconde :

1. Vieux CRT (0 pps)
2. PC Beige (1 pps)
3. LCD basique (5 pps)
4. Laptop moderne (20 pps)
5. PC Gaming (50 pps)
6. Workstation (150 pps)
7. Serveur (500 pps)
8. Datacenter (2000 pps)
9. Supercalculateur (10000 pps)

## Tutoriel

Un tutoriel interactif s'affiche à ta première visite pour t'expliquer les mécaniques du jeu.

## Sauvegarde

Le jeu sauvegarde automatiquement toutes les 5 secondes. Ta progression est stockée dans le navigateur via localStorage.

Tu continues à produire des postes même quand tu quittes le jeu, jusqu'à 8 heures de production hors-ligne.

## Commandes de développement

Ouvre la console du navigateur (F12) et tape `cheat.help()` pour voir les commandes disponibles :

```javascript
cheat.addPoints(n); // Ajouter n points
cheat.setPPS(n); // Définir la production
cheat.triggerEvent(); // Déclencher un événement
cheat.triggerQuiz(); // Déclencher un quiz
cheat.triggerBlackout(); // Déclencher une panne
cheat.triggerBsod(); // Déclencher un Blue Screen
cheat.unlockNird(i); // Débloquer une lettre NIRD
cheat.showTutorial(); // Réafficher le tutoriel
cheat.help(); // Afficher l'aide
```

## Structure du projet

```
nuit-info-2025/
├── index.html
├── css/
│   ├── base.css
│   ├── layout.css
│   └── components/
│       ├── button.css
│       ├── shop.css
│       ├── challenges.css
│       ├── tabs.css
│       ├── notifications.css
│       ├── events.css
│       ├── modals.css
│       ├── computer-art.css
│       ├── blackout.css
│       ├── bsod.css
│       ├── nird.css
│       └── tutorial.css
├── js/
│   ├── config/
│   │   ├── upgrades.js
│   │   ├── challenges.js
│   │   ├── events.js
│   │   ├── quiz.js
│   │   ├── bsod-words.js
│   │   ├── computer-levels.js
│   │   └── nird.js
│   ├── modules/
│   │   ├── computer-art.js
│   │   ├── shop.js
│   │   ├── challenges.js
│   │   ├── save.js
│   │   ├── events.js
│   │   ├── blackout.js
│   │   ├── bsod.js
│   │   ├── quiz.js
│   │   ├── stats.js
│   │   ├── cheat.js
│   │   ├── nird.js
│   │   └── tutorial.js
│   ├── state.js
│   ├── utils.js
│   ├── ui.js
│   └── main.js
└── computer_icons/
    ├── level_0.png
    ├── level_1.png
    └── ...
```

## Technologies utilisées

- HTML5
- CSS3 (animations incluses)
- JavaScript vanilla (aucun framework)
- LocalStorage pour la persistance

## Objectifs pédagogiques

Ce jeu vise à sensibiliser aux concepts du numérique responsable :

- **Logiciel libre** : Linux, outils open source
- **Réemploi** : Reconditionnement, repair cafés
- **Sobriété numérique** : Low-tech, datacenters verts
- **Inclusion numérique** : Formation, accessibilité
- **Communs numériques** : Wikipédia, CHATONS, forges logicielles

## Licence

MIT License - Libre d'utilisation, modification et distribution.

---

Créé pour la Nuit de l'Info 2025
