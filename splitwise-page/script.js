const visualCard = document.querySelector(".visual-card");
const heroPayer = document.getElementById("heroPayer");
const heroAmount = document.getElementById("heroAmount");
const heroStrategy = document.getElementById("heroStrategy");
const heroRule = document.getElementById("heroRule");
const samShare = document.getElementById("samShare");
const pamShare = document.getElementById("pamShare");
const krisShare = document.getElementById("krisShare");
const samBalance = document.getElementById("samBalance");
const pamBalance = document.getElementById("pamBalance");
const krisBalance = document.getElementById("krisBalance");
const eventExpense = document.getElementById("eventExpense");
const eventSplit = document.getElementById("eventSplit");
const eventLedger = document.getElementById("eventLedger");

const copyCodeButton = document.getElementById("copyCodeButton");
const expandCodeButton = document.getElementById("expandCodeButton");
const closeCodeButton = document.getElementById("closeCodeButton");
const javaSource = document.getElementById("javaSource");
const expandedJavaSource = document.getElementById("expandedJavaSource");
const codeModal = document.getElementById("codeModal");
const codeModalTitle = document.getElementById("codeModalTitle");
const backButton = document.getElementById("backButton");

const events = [
  {
    payer: "SAM",
    amount: "1000",
    strategy: "EqualSplit",
    rule: "3 equal shares",
    shares: ["-333.33", "-333.33", "-333.33"],
    balances: ["+666.67", "-333.33", "-333.33"],
    active: "expense"
  },
  {
    payer: "Kris",
    amount: "4000",
    strategy: "EqualSplit",
    rule: "3 equal shares",
    shares: ["-1333.33", "-1333.33", "-1333.33"],
    balances: ["-666.67", "-1666.67", "+2333.33"],
    active: "split"
  },
  {
    payer: "PAM",
    amount: "2000",
    strategy: "PercentageSplit",
    rule: "10 / 40 / 50 percent",
    shares: ["-200.00", "-800.00", "-1000.00"],
    balances: ["-866.67", "-466.67", "+1333.33"],
    active: "ledger"
  }
];

let eventIndex = 0;

function setActiveEvent(active) {
  [eventExpense, eventSplit, eventLedger].forEach((item) => item.classList.remove("active"));

  if (active === "expense") eventExpense.classList.add("active");
  if (active === "split") eventSplit.classList.add("active");
  if (active === "ledger") eventLedger.classList.add("active");
}

function updateHero() {
  const current = events[eventIndex];

  if (visualCard) {
    visualCard.classList.remove("is-updating");
    void visualCard.offsetWidth;
    visualCard.classList.add("is-updating");
  }

  heroPayer.textContent = current.payer;
  heroAmount.textContent = current.amount;
  heroStrategy.textContent = current.strategy;
  heroRule.textContent = current.rule;
  samShare.textContent = current.shares[0];
  pamShare.textContent = current.shares[1];
  krisShare.textContent = current.shares[2];
  samBalance.textContent = current.balances[0];
  pamBalance.textContent = current.balances[1];
  krisBalance.textContent = current.balances[2];
  setActiveEvent(current.active);

  eventIndex = (eventIndex + 1) % events.length;
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

if (copyCodeButton && javaSource) {
  copyCodeButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(javaSource.value);
      copyCodeButton.textContent = "Copied";
      window.setTimeout(() => {
        copyCodeButton.textContent = "Copy code";
      }, 1600);
    } catch (error) {
      copyCodeButton.textContent = "Copy failed";
      window.setTimeout(() => {
        copyCodeButton.textContent = "Copy code";
      }, 1600);
    }
  });
}

function openCodeModal(source, title = "Main.java") {
  if (!codeModal || !expandedJavaSource || !codeModalTitle) return;
  expandedJavaSource.value = source;
  codeModalTitle.textContent = title;
  codeModal.classList.add("open");
  codeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  expandedJavaSource.focus();
}

function closeCodeModal() {
  if (!codeModal) return;
  codeModal.classList.remove("open");
  codeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (expandCodeButton) expandCodeButton.focus();
}

if (expandCodeButton && javaSource) {
  expandCodeButton.addEventListener("click", () => openCodeModal(javaSource.value));
}

if (closeCodeButton) {
  closeCodeButton.addEventListener("click", closeCodeModal);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && codeModal && codeModal.classList.contains("open")) {
    closeCodeModal();
  }
});

if (backButton) {
  backButton.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "../index.html";
  });
}

document.querySelectorAll(".pattern-card pre").forEach((pre, index) => {
  const code = pre.querySelector("code");
  if (!code) return;

  const button = document.createElement("button");
  button.className = "snippet-expand-button";
  button.type = "button";
  button.textContent = "Expand";
  button.addEventListener("click", () => {
    openCodeModal(code.textContent, `Pattern snippet ${index + 1}`);
  });
  pre.appendChild(button);
});

window.addEventListener("load", () => {
  updateHero();
  window.setInterval(updateHero, 2400);
});
