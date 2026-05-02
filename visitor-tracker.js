const ICOUNT_API = "https://icount.kr/api.php";
const ICOUNT_TRACKER = "https://icount.kr/c.js";
const REFRESH_MS = 30000;

function getTrackerId() {
  const host = window.location.hostname || "local-lld-designs";
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

function loadIcountTracker(id) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `${ICOUNT_TRACKER}?id=${encodeURIComponent(id)}`;
  script.dataset.lldTracker = "true";
  document.body.appendChild(script);
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
}

function initVisitorTracker() {
  const trackerId = getTrackerId();
  const widget = createVisitorWidget();

  loadIcountTracker(trackerId);
  refreshStats(trackerId, widget).catch(() => {
    widget.classList.add("is-error");
  });
  window.setInterval(() => {
    refreshStats(trackerId, widget).catch(() => {
      widget.classList.add("is-error");
    });
  }, REFRESH_MS);
}

initVisitorTracker();
