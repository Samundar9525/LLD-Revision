const ICOUNT_API = "https://icount.kr/api.php";
const ICOUNT_TRACKER = "https://icount.kr/c.js";
const REFRESH_MS = 30000;

function getTrackerId() {
  const host = window.location.hostname || "samun-lld-designs";
  const path = window.location.pathname
    .replace(/\/index\.html$/i, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_");
  return path ? `${host}_${path}` : `${host}_home`;
}

function createVisitorWidget() {
  const widget = document.createElement("aside");
  widget.className = "visitor-widget";
  widget.setAttribute("aria-label", "Page visitor statistics");
  widget.innerHTML = `
    <span class="visitor-stat"><span class="visitor-dot" aria-hidden="true"></span><span id="visitorOnline">...</span> online</span>
    <span class="visitor-divider" aria-hidden="true"></span>
    <span class="visitor-stat"><span id="visitorViews">...</span> visits</span>
  `;
  document.body.appendChild(widget);
  return widget;
}

function setWidgetError(widget) {
  const onlineEl = document.getElementById("visitorOnline");
  const viewsEl = document.getElementById("visitorViews");
  if (onlineEl && onlineEl.textContent === "...") onlineEl.textContent = "0";
  if (viewsEl && viewsEl.textContent === "...") viewsEl.textContent = "0";
  widget.classList.add("is-error");
  widget.title = "Live stats will update after the site is hosted and the counter service is reachable.";
}

function hideIcountBadges() {
  document.querySelectorAll('a[href*="icount.kr"], img[src*="icount.kr"], iframe[src*="icount.kr"]').forEach((node) => {
    node.style.display = "none";
  });
}

function loadIcountTracker(id) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `${ICOUNT_TRACKER}?id=${encodeURIComponent(id)}`;
  script.dataset.lldTracker = "true";
  document.body.appendChild(script);
  window.setTimeout(hideIcountBadges, 800);
  window.setTimeout(hideIcountBadges, 2000);
}

async function refreshStats(id, widget) {
  const onlineEl = document.getElementById("visitorOnline");
  const viewsEl = document.getElementById("visitorViews");
  const response = await fetch(`${ICOUNT_API}?id=${encodeURIComponent(id)}`, {
    cache: "no-store"
  });

  if (!response.ok) throw new Error("Unable to load visitor stats");

  const stats = await response.json();
  const totalViews = stats?.total?.pv ?? 0;
  const onlineNow = stats?.realtime ?? 0;

  onlineEl.textContent = Number(onlineNow).toLocaleString("en-IN");
  viewsEl.textContent = Number(totalViews).toLocaleString("en-IN");
  widget.classList.add("is-ready");
  widget.classList.remove("is-error");
}

function initVisitorTracker() {
  const trackerId = getTrackerId();
  const widget = createVisitorWidget();

  loadIcountTracker(trackerId);
  refreshStats(trackerId, widget).catch(() => {
    setWidgetError(widget);
  });
  window.setInterval(() => {
    refreshStats(trackerId, widget).catch(() => {
      setWidgetError(widget);
    });
  }, REFRESH_MS);
}

initVisitorTracker();
