const heroCoupon = document.getElementById("heroCoupon");
const heroStrategy = document.getElementById("heroStrategy");
const heroDecision = document.getElementById("heroDecision");
const heroAmount = document.getElementById("heroAmount");
const heroDiscount = document.getElementById("heroDiscount");
const heroQuantity = document.getElementById("heroQuantity");
const heroFinal = document.getElementById("heroFinal");
const visualCard = document.querySelector(".visual-card");

const copyCodeButton = document.getElementById("copyCodeButton");
const expandCodeButton = document.getElementById("expandCodeButton");
const closeCodeButton = document.getElementById("closeCodeButton");
const javaSource = document.getElementById("javaSource");
const expandedJavaSource = document.getElementById("expandedJavaSource");
const codeModal = document.getElementById("codeModal");
const codeModalTitle = document.getElementById("codeModalTitle");
const backButton = document.getElementById("backButton");

const couponEvents = [
  {
    code: "SAVE100",
    strategy: "FlatDiscount",
    applied: true,
    amount: "1000",
    discount: "100 flat",
    quantity: "99 left",
    final: "900"
  },
  {
    code: "FEST10",
    strategy: "PercentageDiscount",
    applied: true,
    amount: "2000",
    discount: "10 percent",
    quantity: "98 left",
    final: "1800"
  },
  {
    code: "OLD50",
    strategy: "Expired coupon",
    applied: false,
    amount: "750",
    discount: "blocked",
    quantity: "0 left",
    final: "Invalid"
  }
];

let couponIndex = 0;

function setDecision(applied) {
  heroDecision.textContent = applied ? "Applied" : "Rejected";
  heroDecision.classList.remove("allowed", "rejected");
  heroDecision.classList.add(applied ? "allowed" : "rejected");
}

function updateHero() {
  const event = couponEvents[couponIndex];
  if (visualCard) {
    visualCard.classList.remove("is-updating");
    void visualCard.offsetWidth;
    visualCard.classList.add("is-updating");
  }
  heroCoupon.textContent = event.code;
  heroStrategy.textContent = event.strategy;
  setDecision(event.applied);
  heroAmount.textContent = event.amount;
  heroDiscount.textContent = event.discount;
  heroQuantity.textContent = event.quantity;
  heroFinal.textContent = event.final;
  couponIndex = (couponIndex + 1) % couponEvents.length;
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

function openCodeModal(source, title = "CouponDiscount.java") {
  expandedJavaSource.value = source;
  codeModalTitle.textContent = title;
  codeModal.classList.add("open");
  codeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  expandedJavaSource.focus();
}

function closeCodeModal() {
  codeModal.classList.remove("open");
  codeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  expandCodeButton.focus();
}

if (expandCodeButton && codeModal) {
  expandCodeButton.addEventListener("click", () => {
    openCodeModal(javaSource.value, "Main.java");
  });
}

if (closeCodeButton && codeModal) {
  closeCodeButton.addEventListener("click", closeCodeModal);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && codeModal.classList.contains("open")) {
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

document.querySelectorAll(".algorithm-copy pre").forEach((pre, index) => {
  const code = pre.querySelector("code");
  if (!code) {
    return;
  }

  const button = document.createElement("button");
  button.className = "snippet-expand-button";
  button.type = "button";
  button.textContent = "Expand";
  button.addEventListener("click", () => {
    openCodeModal(code.textContent, `Snippet ${index + 1}`);
  });
  pre.appendChild(button);
});

window.addEventListener("load", () => {
  updateHero();
  window.setInterval(updateHero, 2200);
});
