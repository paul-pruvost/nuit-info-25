/**
 * Computer Levels Configuration (Image Evolution)
 * NIRD Clicker Game
 */

const COMPUTER_LEVELS_CONFIG = [
  {
    name: "System-80 Personal",
    image: "computer_icons/computer_1.png"
  },
  {
    name: "Tower AT-386",
    image: "computer_icons/computer_2.png"
  },
  {
    name: "Multimedia Station 586",
    image: "computer_icons/computer_3.png"
  },
  {
    name: "Core Desktop LCD",
    image: "computer_icons/computer_4.png"
  },
  {
    name: "NoteBook Pro G1",
    image: "computer_icons/computer_5.png"
  },
  {
    name: "UltraBook Air",
    image: "computer_icons/computer_6.png"
  },
  {
    name: "Studio Render Unit",
    image: "computer_icons/computer_7.png"
  },
  {
    name: "Data Command Center",
    image: "computer_icons/computer_8.png"
  },
  {
    name: "Vision Glass One",
    image: "computer_icons/computer_9.png"
  }
];

/**
 * Get computer level based on base points per second (without multipliers)
 * @param {Object} state - Game state
 * @returns {number} Computer level (0-8)
 */
function getComputerLevel(state) {
  const pps = state.basePointsPerSecond || 0;
  if (pps >= 10000) return 8;
  if (pps >= 5000) return 7;
  if (pps >= 2000) return 6;
  if (pps >= 1000) return 5;
  if (pps >= 500) return 4;
  if (pps >= 100) return 3;
  if (pps >= 25) return 2;
  if (pps >= 5) return 1;
  return 0;
}
