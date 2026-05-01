const visualCard = document.querySelector(".visual-card");
const vehicleToken = document.getElementById("vehicleToken");
const heroVehicle = document.getElementById("heroVehicle");
const heroTarget = document.getElementById("heroTarget");
const heroRule = document.getElementById("heroRule");
const heroStatus = document.getElementById("heroStatus");
const copyCodeButton = document.getElementById("copyCodeButton");
const expandCodeButton = document.getElementById("expandCodeButton");
const closeCodeButton = document.getElementById("closeCodeButton");
const javaSource = document.getElementById("javaSource");
const expandedJavaSource = document.getElementById("expandedJavaSource");
const codeModal = document.getElementById("codeModal");
const codeModalTitle = document.getElementById("codeModalTitle");
const backButton = document.getElementById("backButton");

const events = [
  { token: "CAR", vehicle: "CAR KA-01", target: "Floor 1, Slot 4", rule: "Type match", status: "Parked" },
  { token: "BUS", vehicle: "BUS DL-22", target: "Floor 1, Slot 25", rule: "Heavy slot", status: "Parked" },
  { token: "BIKE", vehicle: "BIKE MH-09", target: "Floor 2, Slot 55", rule: "Light slot", status: "Parked" }
];

let index = 0;

function updateHero() {
  const event = events[index];
  if (visualCard) {
    visualCard.classList.remove("is-updating");
    void visualCard.offsetWidth;
    visualCard.classList.add("is-updating");
  }
  vehicleToken.textContent = event.token;
  heroVehicle.textContent = event.vehicle;
  heroTarget.textContent = event.target;
  heroRule.textContent = event.rule;
  heroStatus.textContent = event.status;
  index = (index + 1) % events.length;
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

if (copyCodeButton && javaSource) {
  copyCodeButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(javaSource.value);
      copyCodeButton.textContent = "Copied";
      window.setTimeout(() => { copyCodeButton.textContent = "Copy code"; }, 1600);
    } catch (error) {
      copyCodeButton.textContent = "Copy failed";
      window.setTimeout(() => { copyCodeButton.textContent = "Copy code"; }, 1600);
    }
  });
}

function openCodeModal(source, title = "Java snippet") {
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
  expandCodeButton.addEventListener("click", () => openCodeModal(javaSource.value, "Main.java"));
}

if (closeCodeButton) closeCodeButton.addEventListener("click", closeCodeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && codeModal && codeModal.classList.contains("open")) closeCodeModal();
});

document.querySelectorAll(".algorithm-copy pre").forEach((pre, i) => {
  const code = pre.querySelector("code");
  if (!code) return;
  const button = document.createElement("button");
  button.className = "snippet-expand-button";
  button.type = "button";
  button.setAttribute("aria-label", "Expand code snippet");
  button.innerHTML = '<span class="expand-icon" aria-hidden="true"></span>';
  button.addEventListener("click", () => openCodeModal(code.textContent, `Snippet ${i + 1}`));
  pre.appendChild(button);
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

window.addEventListener("load", () => {
  updateHero();
  window.setInterval(updateHero, 2600);
});
