const visualCard = document.querySelector(".visual-card");
const heroMessage = document.getElementById("heroMessage");
const heroUser = document.getElementById("heroUser");
const heroPreference = document.getElementById("heroPreference");
const heroPattern = document.getElementById("heroPattern");
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
  { message: "Maintenance 10PM", user: "SAM", preference: "SMS + EMAIL", pattern: "Observer fan-out", status: "Delivered" },
  { message: "Payment Success", user: "PAM", preference: "WHATSAPP + EMAIL", pattern: "Strategy channel", status: "Delivered" },
  { message: "Security Alert", user: "ALL USERS", preference: "Broadcast", pattern: "Subject notify", status: "Broadcasted" }
];

let index = 0;

function updateHero() {
  const event = events[index];
  if (visualCard) {
    visualCard.classList.remove("is-updating");
    void visualCard.offsetWidth;
    visualCard.classList.add("is-updating");
  }
  heroMessage.textContent = event.message;
  heroUser.textContent = event.user;
  heroPreference.textContent = event.preference;
  heroPattern.textContent = event.pattern;
  heroStatus.textContent = event.status;
  index = (index + 1) % events.length;
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

if (closeCodeButton) {
  closeCodeButton.addEventListener("click", closeCodeModal);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && codeModal && codeModal.classList.contains("open")) {
    closeCodeModal();
  }
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
  window.setInterval(updateHero, 2300);
});
