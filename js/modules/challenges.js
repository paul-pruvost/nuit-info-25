/**
 * Challenges Module - Achievements System
 * NIRD Clicker Game
 */

const challengesEl = document.getElementById("challenges");

/**
 * Initialize the challenges UI
 */
function initChallenges() {
  challengesEl.innerHTML = "";
  
  state.challenges.forEach((c) => {
    const div = document.createElement("div");
    div.className = "challenge" + (c.completed ? " completed" : "");
    div.dataset.id = c.id;

    const icon = document.createElement("div");
    icon.className = "challenge-icon";
    icon.textContent = c.completed ? "✅" : c.icon;

    const content = document.createElement("div");
    content.className = "challenge-content";

    const name = document.createElement("div");
    name.className = "challenge-name";
    name.textContent = c.name;

    const desc = document.createElement("div");
    desc.className = "challenge-desc";
    desc.textContent = c.desc;

    const reward = document.createElement("div");
    reward.className = "challenge-reward";
    reward.textContent = c.reward ? `🎁 ${c.reward.desc}` : "";

    content.appendChild(name);
    content.appendChild(desc);
    content.appendChild(reward);

    div.appendChild(icon);
    div.appendChild(content);

    challengesEl.appendChild(div);
  });
}

/**
 * Update challenges and check for completions
 */
function updateChallenges() {
  state.challenges.forEach((c) => {
    if (c.completed) return;
    
    if (c.condition(state)) {
      c.completed = true;
      const div = challengesEl.querySelector(`[data-id="${c.id}"]`);
      if (div) {
        div.classList.add("completed");
        const icon = div.querySelector(".challenge-icon");
        icon.textContent = "✅";
      }
      
      // Appliquer la récompense
      applyReward(c.reward);
      showNotification(`🎉 Défi complété : ${c.name} (${c.reward.desc})`);
      saveGame();
    }
  });
}

/**
 * Apply a challenge reward to the game state
 * @param {Object} reward - Reward object with type, value, desc
 */
function applyReward(reward) {
  if (!reward) return;
  
  switch (reward.type) {
    case "click":
      state.pointsPerClick += reward.value;
      break;
    case "clickMult":
      state.clickMultiplier += reward.value;
      break;
    case "productionMult":
      state.productionMultiplier += reward.value;
      recalcPPS();
      break;
    case "points":
      state.points += reward.value;
      state.totalPointsEarned += reward.value;
      break;
  }
}
