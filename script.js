const chartViews = {
  sports: {
    kicker: "SPORT CATEGORY",
    title: "Average medals per athlete",
    unit: "AVG. MEDALS",
    footnote: "Illustrative values supplied in the project brief. Confirm the measure and calculation method.",
    takeawayTitle: "Small margins.<br>Big opportunities.",
    takeawayCopy: "Compare medal outcomes with athlete participation to spot sports worth exploring—not just the biggest medal totals.",
    source: "Sample sport metrics from the supplied brief; source data was not included.",
    rows: [
      { label: "Rowing", value: 6.916 },
      { label: "Shooting", value: 6.731 },
      { label: "Swimming", value: 5.84 },
      { label: "Athletics", value: 4.92 }
    ]
  },
  countries: {
    kicker: "GLOBAL PERFORMANCE",
    title: "Total medals by country",
    unit: "MEDALS",
    footnote: "Country totals below are quoted from the project brief and need validation against the medal-results data.",
    takeawayTitle: "Compare the leaders.<br>Then add context.",
    takeawayCopy: "Totals show scale, but population, event count, Games season, and historical country definitions can change the comparison.",
    source: "United States and China figures are from the supplied brief; other bars are illustrative placeholders.",
    rows: [
      { label: "United States", value: 735 },
      { label: "China", value: 696 },
      { label: "Japan", value: 105 },
      { label: "Other", value: 82 }
    ]
  },
  trends: {
    kicker: "MEDAL TRENDS",
    title: "Total medals awarded over time",
    unit: "TOTAL MEDALS",
    footnote: "Only the three year/value pairs stated in the brief are shown; the line between them is illustrative.",
    takeawayTitle: "A trend needs<br>the full timeline.",
    takeawayCopy: "A complete year-by-year series can reveal changes in medal totals. Check which Games editions and events are included.",
    source: "Values for 2000, 2020, and 2026 are quoted from the supplied brief and not independently verified.",
    line: [
      { year: "2000", value: 305, x: 70, y: 137 },
      { year: "2020", value: 363, x: 270, y: 44 },
      { year: "2026", value: 334, x: 470, y: 90 }
    ]
  }
};

const chartContainer = document.querySelector("#chart-container");
const chartPanel = document.querySelector("#chart-panel");
const tabs = [...document.querySelectorAll(".view-tab")];

function renderBars(rows) {
  const max = Math.max(...rows.map((row) => row.value));
  chartContainer.innerHTML = `<div class="bar-chart">${rows.map((row) => {
    const width = Math.max(8, (row.value / max) * 100);
    return `<div class="bar-row">
      <span class="bar-label">${row.label}</span>
      <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="--bar-width:${width}%"></span></span>
      <span class="bar-value">${Number.isInteger(row.value) ? row.value : row.value.toFixed(3)}</span>
    </div>`;
  }).join("")}</div>`;
}

function renderLine(points) {
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${points[points.length - 1].x} 165 L ${points[0].x} 165 Z`;
  chartContainer.innerHTML = `<svg class="line-chart" viewBox="0 0 520 190" role="img" aria-label="Illustrative medal totals: 305 in 2000, 363 in 2020, and 334 in 2026">
    <defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#526ff3" stop-opacity=".2"></stop><stop offset="1" stop-color="#526ff3" stop-opacity="0"></stop></linearGradient></defs>
    <line class="gridline" x1="45" y1="45" x2="495" y2="45"></line>
    <line class="gridline" x1="45" y1="95" x2="495" y2="95"></line>
    <line class="gridline" x1="45" y1="145" x2="495" y2="145"></line>
    <path class="trend-area" d="${area}"></path>
    <path class="trend-line" d="${path}"></path>
    ${points.map((point) => `<circle class="point" cx="${point.x}" cy="${point.y}" r="5"></circle><text x="${point.x}" y="${point.y - 12}" text-anchor="middle">${point.value}</text><text x="${point.x}" y="182" text-anchor="middle">${point.year}</text>`).join("")}
  </svg>`;
}

function showView(viewName) {
  const view = chartViews[viewName];
  if (!view) return;

  document.querySelector("#chart-kicker").textContent = view.kicker;
  document.querySelector("#chart-title").textContent = view.title;
  document.querySelector("#chart-unit").textContent = view.unit;
  document.querySelector("#chart-footnote").textContent = view.footnote;
  document.querySelector("#takeaway-title").innerHTML = view.takeawayTitle;
  document.querySelector("#takeaway-copy").textContent = view.takeawayCopy;
  document.querySelector("#source-note").textContent = view.source;
  if (view.rows) renderBars(view.rows);
  else renderLine(view.line);

  tabs.forEach((tab) => {
    const active = tab.dataset.view === viewName;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  chartPanel.setAttribute("aria-labelledby", `tab-${viewName}`);
}

tabs.forEach((tab) => tab.addEventListener("click", () => showView(tab.dataset.view)));
document.querySelectorAll("[data-switch-view]").forEach((link) => {
  link.addEventListener("click", () => showView(link.dataset.switchView));
});

showView("sports");
