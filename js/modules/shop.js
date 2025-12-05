/**
 * Shop Module - Upgrades Management
 * NIRD Clicker Game
 */

const shopEl = document.getElementById("shop");

/**
 * Initialize the shop UI
 */
function initShop() {
  shopEl.innerHTML = "";

  state.upgrades.forEach((u) => {
    const cost = computeCost(u.baseCost, u.count);
    const canBuy = state.points >= cost;

    const div = document.createElement("div");
    div.className = "upgrade";
    div.dataset.id = u.id;

    const icon = document.createElement("div");
    icon.className = "upgrade-icon";
    icon.textContent = u.icon;

    const content = document.createElement("div");
    content.className = "upgrade-content";

    const nameLine = document.createElement("div");
    nameLine.className = "upgrade-name-line";

    const name = document.createElement("div");
    name.className = "upgrade-name";
    name.textContent = u.name;

    const count = document.createElement("div");
    count.className = "upgrade-count";
    count.textContent = "x" + u.count;

    nameLine.appendChild(name);
    nameLine.appendChild(count);

    const desc = document.createElement("div");
    desc.className = "upgrade-desc";
    desc.textContent = u.desc;

    const meta = document.createElement("div");
    meta.className = "upgrade-meta";
    meta.innerHTML =
      "<span>Coût : " + formatNumber(cost) + " postes</span>" +
      "<span>+" + u.cps + " postes/s</span>";

    content.appendChild(nameLine);
    content.appendChild(desc);
    content.appendChild(meta);

    const button = document.createElement("button");
    button.textContent = "Acheter";
    button.disabled = !canBuy;
    button.addEventListener("click", () => {
      buyUpgrade(u.id);
    });

    div.appendChild(icon);
    div.appendChild(content);
    div.appendChild(button);

    shopEl.appendChild(div);
  });
}

/**
 * Update the shop UI (without recreating elements)
 */
function updateShop() {
  state.upgrades.forEach((u) => {
    const div = shopEl.querySelector(`[data-id="${u.id}"]`);
    if (!div) return;

    const cost = computeCost(u.baseCost, u.count);
    const canBuy = state.points >= cost;

    const countEl = div.querySelector(".upgrade-count");
    countEl.textContent = "x" + u.count;

    const metaEl = div.querySelector(".upgrade-meta");
    metaEl.innerHTML =
      "<span>Coût : " + formatNumber(cost) + " postes</span>" +
      "<span>+" + u.cps + " postes/s</span>";

    const button = div.querySelector("button");
    button.disabled = !canBuy;
  });
}

/**
 * Buy an upgrade by ID
 * @param {string} id - Upgrade ID
 */
function buyUpgrade(id) {
  if (blackoutActive || bsodActive) return; // Bloqué pendant la panne ou BSOD
  
  const upgrade = state.upgrades.find((u) => u.id === id);
  if (!upgrade) return;
  const cost = computeCost(upgrade.baseCost, upgrade.count);
  if (state.points < cost) return;

  state.points -= cost;
  upgrade.count += 1;
  recalcPPS();
  saveGame();
  
  // Forcer la mise à jour de l'ordinateur après un achat
  forceComputerRefresh();
  
  updateUI();
}
