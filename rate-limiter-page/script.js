const incomingRequest = document.getElementById("incomingRequest");
const heroAlgorithm = document.getElementById("heroAlgorithm");
const heroDecision = document.getElementById("heroDecision");
const heroThread = document.getElementById("heroThread");
const heroRequest = document.getElementById("heroRequest");
const heroStatus = document.getElementById("heroStatus");
const heroReason = document.getElementById("heroReason");

const fixedIncoming = document.getElementById("fixedIncoming");
const fixedDecision = document.getElementById("fixedDecision");
const fixedReason = document.getElementById("fixedReason");
const fixedWindowTrack = document.getElementById("fixedWindowTrack");

const slidingIncoming = document.getElementById("slidingIncoming");
const slidingDecision = document.getElementById("slidingDecision");
const slidingReason = document.getElementById("slidingReason");
const slidingLane = document.getElementById("slidingLane");

const tokenIncoming = document.getElementById("tokenIncoming");
const tokenDecision = document.getElementById("tokenDecision");
const tokenReason = document.getElementById("tokenReason");
const tokenLiquid = document.getElementById("tokenLiquid");
const tokenCount = document.getElementById("tokenCount");

const copyCodeButton = document.getElementById("copyCodeButton");
const javaSource = document.getElementById("javaSource");
const backButton = document.getElementById("backButton");

const heroEvents = [
  { request: "REQ 0012", algorithm: "Fixed Window", thread: "pool-1-thread-3", allowed: true, reason: "within threshold" },
  { request: "REQ 0013", algorithm: "Sliding Window", thread: "pool-1-thread-7", allowed: false, reason: "sliding window capacity exceeded" },
  { request: "REQ 0014", algorithm: "Token Bucket", thread: "pool-1-thread-2", allowed: true, reason: "token available" }
];

const fixedStates = [
  { request: "REQ F11", allowed: true, reason: "count within threshold", fill: 1 },
  { request: "REQ F12", allowed: true, reason: "count within threshold", fill: 3 },
  { request: "REQ F13", allowed: false, reason: "window threshold reached", fill: 5 }
];

const slidingStates = [
  { request: "REQ S20", allowed: true, reason: "recent log has room", chips: 2 },
  { request: "REQ S21", allowed: true, reason: "recent log has room", chips: 4 },
  { request: "REQ S22", allowed: false, reason: "sliding window capacity exceeded", chips: 5 }
];

const tokenStates = [
  { request: "REQ T06", allowed: true, reason: "token available", tokens: 4 },
  { request: "REQ T07", allowed: true, reason: "token available", tokens: 2 },
  { request: "REQ T08", allowed: false, reason: "no tokens available", tokens: 0 }
];

let heroIndex = 0;
let fixedIndex = 0;
let slidingIndex = 0;
let tokenIndex = 0;

function setDecisionBlock(element, allowed, text) {
  element.textContent = text;
  element.classList.remove("allowed", "rejected");
  element.classList.add(allowed ? "allowed" : "rejected");
}

function buildFixedSlots() {
  fixedWindowTrack.innerHTML = "";
  for (let i = 0; i < 5; i += 1) {
    const slot = document.createElement("div");
    slot.className = "fixed-slot";
    fixedWindowTrack.appendChild(slot);
  }
}

function updateHero() {
  const event = heroEvents[heroIndex];
  incomingRequest.textContent = event.request;
  heroAlgorithm.textContent = event.algorithm;
  setDecisionBlock(heroDecision, event.allowed, event.allowed ? "Allowed" : "Rejected");
  heroThread.textContent = event.thread;
  heroRequest.textContent = event.request;
  heroStatus.textContent = event.allowed ? "Allowed" : "Rejected";
  heroReason.textContent = event.reason;
  heroIndex = (heroIndex + 1) % heroEvents.length;
}

function updateFixed() {
  const state = fixedStates[fixedIndex];
  fixedIncoming.textContent = state.request;
  setDecisionBlock(fixedDecision, state.allowed, state.allowed ? "Allowed" : "Rejected");
  fixedReason.textContent = `Reason: ${state.reason}`;
  [...fixedWindowTrack.children].forEach((slot, index) => {
    slot.classList.toggle("active", index < state.fill);
  });
  fixedIndex = (fixedIndex + 1) % fixedStates.length;
}

function updateSliding() {
  const state = slidingStates[slidingIndex];
  slidingIncoming.textContent = state.request;
  setDecisionBlock(slidingDecision, state.allowed, state.allowed ? "Allowed" : "Rejected");
  slidingReason.textContent = `Reason: ${state.reason}`;
  slidingLane.innerHTML = "";
  for (let i = 0; i < state.chips; i += 1) {
    const chip = document.createElement("div");
    chip.className = "sliding-chip";
    chip.style.left = `${18 + (i * 52)}px`;
    slidingLane.appendChild(chip);
  }
  slidingIndex = (slidingIndex + 1) % slidingStates.length;
}

function updateToken() {
  const state = tokenStates[tokenIndex];
  tokenIncoming.textContent = state.request;
  setDecisionBlock(tokenDecision, state.allowed, state.allowed ? "Allowed" : "Rejected");
  tokenReason.textContent = `Reason: ${state.reason}`;
  tokenLiquid.style.height = `${(state.tokens / 5) * 100}%`;
  tokenCount.textContent = `${state.tokens} / 5`;
  tokenIndex = (tokenIndex + 1) % tokenStates.length;
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

if (backButton) {
  backButton.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "../index.html";
  });
}

window.addEventListener("load", () => {
  buildFixedSlots();
  updateHero();
  updateFixed();
  updateSliding();
  updateToken();

  window.setInterval(updateHero, 2200);
  window.setInterval(updateFixed, 1700);
  window.setInterval(updateSliding, 1900);
  window.setInterval(updateToken, 2100);
});
