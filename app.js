/**
 * app.js — Mishnayos Completion Tracker
 *
 * Modules:
 *  1. DATA        – Mishna dataset (from mishnayos.json embedded inline)
 *  2. STATE       – Application state (completed counts, settings)
 *  3. CALCULATOR  – Schedule & projection computation
 *  4. RENDERER    – DOM rendering helpers
 *  5. LANGUAGE    – Hebrew / English toggle
 *  6. PDF         – Export to PDF via browser print
 *  7. MAIN        – Initialisation & event wiring
 */

/* ============================================================
   1. DATA — Full Mishna dataset
   ============================================================ */

/** @type {MishnaData} */
const MISHNA_DATA = {
  "source": "https://www.mishnah.org/learn/",
  "sedarim": [
    {
      "seder_en": "Zeraim", "seder_he": "זרעים",
      "mesechtos": [
        {"name_en": "Berachos",    "name_he": "ברכות",     "mishnayos_count": 57},
        {"name_en": "Peah",        "name_he": "פאה",        "mishnayos_count": 69},
        {"name_en": "Demai",       "name_he": "דמאי",       "mishnayos_count": 53},
        {"name_en": "Kilayim",     "name_he": "כלאים",      "mishnayos_count": 77},
        {"name_en": "Sheviis",     "name_he": "שביעית",     "mishnayos_count": 89},
        {"name_en": "Terumos",     "name_he": "תרומות",     "mishnayos_count": 101},
        {"name_en": "Maasros",     "name_he": "מעשרות",     "mishnayos_count": 40},
        {"name_en": "Maaser Sheni","name_he": "מעשר שני",   "mishnayos_count": 57},
        {"name_en": "Challah",     "name_he": "חלה",        "mishnayos_count": 38},
        {"name_en": "Orlah",       "name_he": "ערלה",       "mishnayos_count": 35},
        {"name_en": "Bikkurim",    "name_he": "ביכורים",    "mishnayos_count": 39}
      ]
    },
    {
      "seder_en": "Moed", "seder_he": "מועד",
      "mesechtos": [
        {"name_en": "Shabbos",       "name_he": "שבת",         "mishnayos_count": 139},
        {"name_en": "Eruvin",        "name_he": "עירובין",      "mishnayos_count": 96},
        {"name_en": "Pesachim",      "name_he": "פסחים",        "mishnayos_count": 89},
        {"name_en": "Shekalim",      "name_he": "שקלים",        "mishnayos_count": 52},
        {"name_en": "Yoma",          "name_he": "יומא",         "mishnayos_count": 61},
        {"name_en": "Sukkah",        "name_he": "סוכה",         "mishnayos_count": 53},
        {"name_en": "Beitzah",       "name_he": "ביצה",         "mishnayos_count": 42},
        {"name_en": "Rosh Hashanah", "name_he": "ראש השנה",     "mishnayos_count": 35},
        {"name_en": "Taanis",        "name_he": "תענית",        "mishnayos_count": 34},
        {"name_en": "Megillah",      "name_he": "מגילה",        "mishnayos_count": 33},
        {"name_en": "Moed Katan",    "name_he": "מועד קטן",     "mishnayos_count": 24},
        {"name_en": "Chagigah",      "name_he": "חגיגה",        "mishnayos_count": 23}
      ]
    },
    {
      "seder_en": "Nashim", "seder_he": "נשים",
      "mesechtos": [
        {"name_en": "Yevamos",   "name_he": "יבמות",   "mishnayos_count": 128},
        {"name_en": "Kesuvos",   "name_he": "כתובות",  "mishnayos_count": 111},
        {"name_en": "Nedarim",   "name_he": "נדרים",   "mishnayos_count": 90},
        {"name_en": "Nazir",     "name_he": "נזיר",    "mishnayos_count": 60},
        {"name_en": "Sotah",     "name_he": "סוטה",    "mishnayos_count": 67},
        {"name_en": "Gittin",    "name_he": "גיטין",   "mishnayos_count": 75},
        {"name_en": "Kiddushin", "name_he": "קידושין", "mishnayos_count": 47}
      ]
    },
    {
      "seder_en": "Nezikin", "seder_he": "נזיקין",
      "mesechtos": [
        {"name_en": "Bava Kamma",   "name_he": "בבא קמא",   "mishnayos_count": 79},
        {"name_en": "Bava Metzia",  "name_he": "בבא מציעא", "mishnayos_count": 101},
        {"name_en": "Bava Basra",   "name_he": "בבא בתרא",  "mishnayos_count": 86},
        {"name_en": "Sanhedrin",    "name_he": "סנהדרין",   "mishnayos_count": 71},
        {"name_en": "Makkos",       "name_he": "מכות",      "mishnayos_count": 34},
        {"name_en": "Shevuos",      "name_he": "שבועות",    "mishnayos_count": 62},
        {"name_en": "Eduyos",       "name_he": "עדיות",     "mishnayos_count": 74},
        {"name_en": "Avodah Zarah", "name_he": "עבודה זרה", "mishnayos_count": 50},
        {"name_en": "Avos",         "name_he": "אבות",      "mishnayos_count": 108},
        {"name_en": "Horayos",      "name_he": "הוריות",    "mishnayos_count": 20}
      ]
    },
    {
      "seder_en": "Kodashim", "seder_he": "קדשים",
      "mesechtos": [
        {"name_en": "Zevachim",  "name_he": "זבחים",  "mishnayos_count": 101},
        {"name_en": "Menachos",  "name_he": "מנחות",  "mishnayos_count": 93},
        {"name_en": "Chullin",   "name_he": "חולין",  "mishnayos_count": 74},
        {"name_en": "Bechoros",  "name_he": "בכורות", "mishnayos_count": 73},
        {"name_en": "Eruchin",   "name_he": "ערכין",  "mishnayos_count": 50},
        {"name_en": "Temurah",   "name_he": "תמורה",  "mishnayos_count": 35},
        {"name_en": "Kerisos",   "name_he": "כריתות", "mishnayos_count": 43},
        {"name_en": "Meilah",    "name_he": "מעילה",  "mishnayos_count": 38},
        {"name_en": "Tamid",     "name_he": "תמיד",   "mishnayos_count": 34},
        {"name_en": "Middos",    "name_he": "מדות",   "mishnayos_count": 34},
        {"name_en": "Kinnim",    "name_he": "קינים",  "mishnayos_count": 15}
      ]
    },
    {
      "seder_en": "Taharos", "seder_he": "טהרות",
      "mesechtos": [
        {"name_en": "Keilim",     "name_he": "כלים",      "mishnayos_count": 254},
        {"name_en": "Oholos",     "name_he": "אהלות",     "mishnayos_count": 134},
        {"name_en": "Negaim",     "name_he": "נגעים",     "mishnayos_count": 115},
        {"name_en": "Parah",      "name_he": "פרה",       "mishnayos_count": 96},
        {"name_en": "Taharos",    "name_he": "טהרות",     "mishnayos_count": 92},
        {"name_en": "Mikvaos",    "name_he": "מקואות",    "mishnayos_count": 71},
        {"name_en": "Niddah",     "name_he": "נדה",       "mishnayos_count": 79},
        {"name_en": "Machshirin", "name_he": "מכשירין",   "mishnayos_count": 54},
        {"name_en": "Zavim",      "name_he": "זבים",      "mishnayos_count": 32},
        {"name_en": "Tevul Yom",  "name_he": "טבול יום",  "mishnayos_count": 26},
        {"name_en": "Yadayim",    "name_he": "ידים",      "mishnayos_count": 22},
        {"name_en": "Uktzin",     "name_he": "עוקצים",    "mishnayos_count": 28}
      ]
    }
  ]
};

/* ============================================================
   2. STATE — Application state
   ============================================================ */

/**
 * completedCounts: maps "seder_index-mesechta_index" → completed count (number)
 * scheduleMode: "target-date" | "daily-pace"
 * targetDate: Date | null
 * dailyPace: number
 * isHebrew: boolean
 * activeSederIndex: number (which tab is selected in the progress section)
 */
const state = {
  completedCounts: {},   // e.g. { "0-0": 30 }  (sederIdx-mesechtaIdx)
  scheduleMode: "daily-pace",  targetDate: null,
  dailyPace: 3,
  isHebrew: false,
  hebrewNames: false,
  activeSederIndex: 0,
  // Set of seder indices included in the study goal (default: all)
  selectedSedarim: new Set(MISHNA_DATA.sedarim.map((_, i) => i))
};

/* Pre-compute a flat list of all masechtos with indices for easy iteration */
const ALL_MASECHTOS = [];  // { sederIdx, mesechtaIdx, seder_en, seder_he, ...mesechta }
MISHNA_DATA.sedarim.forEach((seder, si) => {
  seder.mesechtos.forEach((m, mi) => {
    ALL_MASECHTOS.push({
      sederIdx: si,
      mesechtaIdx: mi,
      seder_en: seder.seder_en,
      seder_he: seder.seder_he,
      ...m
    });
  });
});

/** Total Mishnayos across all masechtos */
const TOTAL_MISHNAYOS = ALL_MASECHTOS.reduce((sum, m) => sum + m.mishnayos_count, 0);

/* ============================================================
   3. CALCULATOR — Projection logic
   ============================================================ */

const Calculator = (() => {

  /** Returns number of completed Mishnayos for a given key */
  function getCompleted(sederIdx, mesechtaIdx) {
    const key = `${sederIdx}-${mesechtaIdx}`;
    return Math.min(
      state.completedCounts[key] || 0,
      ALL_MASECHTOS.find(m => m.sederIdx === sederIdx && m.mesechtaIdx === mesechtaIdx).mishnayos_count
    );
  }

  /** Returns only the masechtos that belong to the user's selected sedarim goal */
  function getGoalMasechtos() {
    return ALL_MASECHTOS.filter(m => state.selectedSedarim.has(m.sederIdx));
  }

  /** Total Mishnayos in the selected sedarim */
  function getGoalTotal() {
    return getGoalMasechtos().reduce((sum, m) => sum + m.mishnayos_count, 0);
  }

  /** Returns total completed Mishnayos within the goal sedarim */
  function getTotalCompleted() {
    return getGoalMasechtos().reduce((sum, m) => sum + getCompleted(m.sederIdx, m.mesechtaIdx), 0);
  }

  /** Returns total remaining Mishnayos within the goal sedarim */
  function getTotalRemaining() {
    return getGoalTotal() - getTotalCompleted();
  }

  /**
   * Strips time from a Date, returning midnight local time.
   * @param {Date} d
   * @returns {Date}
   */
  function toMidnight(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  /**
   * Adds `days` days to a Date, returning a new Date.
   * @param {Date} d
   * @param {number} days
   * @returns {Date}
   */
  function addDays(d, days) {
    const result = new Date(d);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Formats a Date as a locale-aware string (e.g. "Mon, Apr 27, 2026").
   * @param {Date} d
   * @returns {string}
   */
  function formatDate(d) {
    return d.toLocaleDateString(state.isHebrew ? "he-IL" : "en-US", {
      weekday: "short", year: "numeric", month: "short", day: "numeric"
    });
  }

  /**
   * Returns days between today (midnight) and a target Date.
   * @param {Date} targetDate
   * @returns {number}
   */
  function daysUntil(targetDate) {
    const today = toMidnight(new Date());
    const target = toMidnight(targetDate);
    return Math.round((target - today) / 86400000);
  }

  /**
   * Computes the projected completion date for each mesechta.
   *
   * Walks through the mesechta queue in order, accumulating daily capacity,
   * and records the day on which each mesechta's remaining count is exhausted.
   *
   * @param {number} perDay
   * @returns {MesechtaProjection[]}
   */
  function projectMesechtaDates(perDay) {
    const today = toMidnight(new Date());
    // Only project for masechtos in the selected sedarim
    const goalMasechtos = getGoalMasechtos();

    return goalMasechtos.map(m => {
      const completed = getCompleted(m.sederIdx, m.mesechtaIdx);
      const remaining = m.mishnayos_count - completed;
      return { ...m, completed, remaining };
    }).map((m, idx, arr) => {
      // Cumulative remaining up to and including this mesechta
      const cumulativeRemaining = arr
        .slice(0, idx + 1)
        .reduce((sum, x) => sum + x.remaining, 0);

      let completionDate = null;
      if (m.remaining > 0 && perDay > 0) {
        const daysNeeded = Math.ceil(cumulativeRemaining / perDay);
        completionDate = addDays(today, daysNeeded);
      }

      return {
        ...m,
        completionDate,
        alreadyDone: m.remaining === 0
      };
    });
  }

  /**
   * Main entry point: validates inputs and computes all projections.
   *
   * @returns {{ ok: boolean, error?: string, result?: ProjectionResult }}
   */
  function compute() {
    if (state.selectedSedarim.size === 0) {
      return { ok: false, error: "Please select at least one Seder as your goal." };
    }

    const remaining = getTotalRemaining();
    const goalTotal = getGoalTotal();

    if (remaining === 0) {
      return { ok: true, result: { done: true, goalTotal } };
    }

    let perDay, totalDays, projectedEndDate;

    if (state.scheduleMode === "target-date") {
      if (!state.targetDate) {
        return { ok: false, error: "Please select a target completion date." };
      }
      const days = daysUntil(state.targetDate);
      if (days <= 0) {
        return { ok: false, error: "Target date must be in the future." };
      }
      totalDays = days;
      perDay = remaining / totalDays;
      projectedEndDate = state.targetDate;
    } else {
      if (!state.dailyPace || state.dailyPace < 1) {
        return { ok: false, error: "Daily pace must be at least 1 Mishna." };
      }
      perDay = state.dailyPace;
      totalDays = Math.ceil(remaining / perDay);
      projectedEndDate = addDays(toMidnight(new Date()), totalDays);
    }

    const mesechtaProjections = projectMesechtaDates(perDay);

    return {
      ok: true,
      result: {
        done: false,
        remaining,
        goalTotal,
        perDay: Math.round(perDay * 10) / 10, // round to 1 decimal
        totalDays,
        projectedEndDate,
        mesechtaProjections
      }
    };
  }

  return { compute, getTotalCompleted, getTotalRemaining, getCompleted, formatDate, getGoalMasechtos, getGoalTotal };
})();

/* ============================================================
   4. RENDERER — DOM rendering helpers
   ============================================================ */

const Renderer = (() => {

  /* ---------- Element references ---------- */
  const els = {
    totalCompleted:     document.getElementById("total-completed"),
    totalMishnayos:     document.getElementById("total-mishnayos"),
    overallProgressBar: document.getElementById("overall-progress-bar"),
    overallProgressWrap:document.getElementById("overall-progress-bar-wrap"),

    dashboardSection:   document.getElementById("schedule-section"),
    statRemaining:      document.getElementById("stat-remaining"),
    statPerDay:         document.getElementById("stat-per-day"),
    statDays:           document.getElementById("stat-days"),
    statEndDate:        document.getElementById("stat-end-date"),

    mesechtaDatesSection: document.getElementById("mesechta-dates-section"),
    mesechtaTableBody:  document.getElementById("mesechta-table-body"),
    calcSummary:        document.getElementById("calc-summary"),

    targetDateError:    document.getElementById("target-date-error"),
    dailyPaceError:     document.getElementById("daily-pace-error"),
  };

  /** Shows or hides an element using the HTML `hidden` attribute */
  function setVisible(el, visible) {
    el.hidden = !visible;
  }

  /** Displays an error message in the given error paragraph */
  function showError(el, message) {
    el.textContent = message;
    setVisible(el, true);
  }

  function clearErrors() {
    setVisible(els.targetDateError, false);
    setVisible(els.dailyPaceError, false);
    const sederGoalError = document.getElementById("seder-goal-error");
    if (sederGoalError) sederGoalError.hidden = true;
    document.getElementById("target-date").classList.remove("invalid");
    document.getElementById("daily-pace").classList.remove("invalid");
  }

  /**
   * Updates the overall progress bar and per-seder progress indicators.
   * Counts are scoped to the user's selected sedarim (goal).
   */
  function renderProgressSummary() {
    const totalCompleted = Calculator.getTotalCompleted();
    const goalTotal = Calculator.getGoalTotal();
    const pct = goalTotal > 0 ? Math.round((totalCompleted / goalTotal) * 100) : 0;

    els.totalCompleted.textContent = totalCompleted.toLocaleString();
    els.totalMishnayos.textContent = goalTotal.toLocaleString();
    els.overallProgressBar.style.width = `${pct}%`;
    els.overallProgressWrap.setAttribute("aria-valuenow", pct);
    els.overallProgressWrap.setAttribute("aria-label", `Overall progress: ${pct}%`);

    // Update per-seder progress bars and text in the disclosure widgets
    MISHNA_DATA.sedarim.forEach((seder, si) => {
      const sederMasechtos = ALL_MASECHTOS.filter(m => m.sederIdx === si);
      const sederTotal = sederMasechtos.reduce((sum, m) => sum + m.mishnayos_count, 0);
      const sederCompleted = sederMasechtos.reduce(
        (sum, m) => sum + Calculator.getCompleted(m.sederIdx, m.mesechtaIdx), 0
      );
      const sederPct = Math.round((sederCompleted / sederTotal) * 100);
      const countStr = `${sederCompleted.toLocaleString()} / ${sederTotal.toLocaleString()}`;

      const barFill = document.getElementById(`seder-mini-bar-${si}`);
      if (barFill) barFill.style.width = `${sederPct}%`;

      const barWrap = document.getElementById(`seder-bar-wrap-${si}`);
      if (barWrap) {
        barWrap.setAttribute("aria-valuenow", sederPct);
        barWrap.setAttribute("aria-label", `${seder.seder_en} progress ${sederPct}%`);
      }

      const progressTextEl = document.getElementById(`seder-progress-text-${si}`);
      if (progressTextEl) {
        progressTextEl.querySelectorAll("span").forEach(s => { s.textContent = countStr; });
      }
    });
  }

  /**
   * Renders the dashboard stat cards.
   * @param {ProjectionResult} result
   */
  function renderDashboard(result) {
    if (result.done) {
      els.statRemaining.textContent = "0";
      els.statPerDay.textContent    = "–";
      els.statDays.textContent      = "–";
      els.statEndDate.innerHTML = `<span class="lang-en"${state.isHebrew ? " hidden" : ""}>Complete! 🎉</span><span class="lang-he"${state.isHebrew ? "" : " hidden"}>הושלם! 🎉</span>`;
      if (els.calcSummary) els.calcSummary.hidden = true;
    } else {
      els.statRemaining.textContent = result.remaining.toLocaleString();
      els.statPerDay.textContent    = result.perDay % 1 === 0
        ? result.perDay.toString()
        : result.perDay.toFixed(1);
      els.statDays.textContent      = result.totalDays.toLocaleString();
      els.statEndDate.textContent   = Calculator.formatDate(result.projectedEndDate);
    }
    setVisible(els.dashboardSection, true);
  }

  /**
   * Renders the calculation breakdown callout above the mesechta table.
   * Shows: remaining ÷ days = per-day rate.
   * @param {ProjectionResult} result
   */
  function renderCalcSummary(result) {
    if (!els.calcSummary || result.done) {
      if (els.calcSummary) els.calcSummary.hidden = true;
      return;
    }
    const perDayStr = result.perDay % 1 === 0
      ? result.perDay.toString()
      : result.perDay.toFixed(1);
    const enText = `${result.remaining.toLocaleString()} remaining Mishnayos ÷ ${result.totalDays.toLocaleString()} days = <strong>${perDayStr} Mishnayos / day</strong>`;
    const heText = `${result.remaining.toLocaleString()} משניות שנותרו ÷ ${result.totalDays.toLocaleString()} ימים = <strong>${perDayStr} משניות / יום</strong>`;
    els.calcSummary.querySelector(".lang-en").innerHTML = enText;
    els.calcSummary.querySelector(".lang-he").innerHTML = heText;
    els.calcSummary.hidden = false;
  }

  /**
   * Renders the per-mesechta completion date table, grouped by Seder.
   * Each seder gets a full-width header row; no Seder column in data rows.
   * @param {MesechtaProjection[]} projections
   */
  function renderMesechtaTable(projections) {
    els.mesechtaTableBody.innerHTML = "";

    // Group projections by sederIdx, preserving dataset order
    const groups = new Map();
    projections.forEach(p => {
      if (!groups.has(p.sederIdx)) groups.set(p.sederIdx, []);
      groups.get(p.sederIdx).push(p);
    });

    let isFirst = true;
    groups.forEach((masechtos, sederIdx) => {
      const seder = MISHNA_DATA.sedarim[sederIdx];

      // Seder group header row (spans all 3 data columns)
      const groupTr = document.createElement("tr");
      groupTr.className = "seder-group-header" + (isFirst ? "" : " seder-group-header--subsequent");
      const showHebNames = state.isHebrew || state.hebrewNames;
      groupTr.innerHTML = `<td colspan="3"><span class="name-en"${showHebNames ? " hidden" : ""}>${escapeHtml(seder.seder_en)}</span><span class="name-he"${showHebNames ? "" : " hidden"}>${escapeHtml(seder.seder_he)}</span></td>`;
      els.mesechtaTableBody.appendChild(groupTr);
      isFirst = false;

      // Individual mesechta rows
      masechtos.forEach(p => {
        const tr = document.createElement("tr");
        if (p.alreadyDone) tr.classList.add("row-completed");

        let completionText;
        if (p.alreadyDone) {
          completionText = `<span class="badge badge-done"><span class="lang-en"${state.isHebrew ? " hidden" : ""}>Done ✓</span><span class="lang-he"${state.isHebrew ? "" : " hidden"}>הושלם</span></span>`;
        } else if (p.completionDate) {
          completionText = `<span class="badge badge-pending">${Calculator.formatDate(p.completionDate)}</span>`;
        } else {
          completionText = "–";
        }

        tr.innerHTML = `
          <td><strong><span class="name-en"${showHebNames ? " hidden" : ""}>${escapeHtml(p.name_en)}</span><span class="name-he"${showHebNames ? "" : " hidden"}>${escapeHtml(p.name_he)}</span></strong></td>
          <td>${p.mishnayos_count}</td>
          <td>${completionText}</td>
        `;
        els.mesechtaTableBody.appendChild(tr);
      });
    });

    setVisible(els.mesechtaDatesSection, true);
  }

  /** Hides result sections (called on reset or before re-render) */
  function hideResults() {
    setVisible(els.dashboardSection, false);
    setVisible(els.mesechtaDatesSection, false);
    if (els.calcSummary) els.calcSummary.hidden = true;
  }

  /** Simple HTML escaping to prevent XSS from data fields */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  return {
    els,
    renderProgressSummary,
    renderDashboard,
    renderCalcSummary,
    renderMesechtaTable,
    hideResults,
    showError,
    clearErrors,
    setVisible
  };
})();

/* ============================================================
   5. LANGUAGE — Hebrew / English toggle
   ============================================================ */

const Language = (() => {

  function applyLanguage() {
    if (state.isHebrew) {
      document.body.classList.add("lang-he");
      document.documentElement.setAttribute("lang", "he");
      document.documentElement.setAttribute("dir", "rtl");
      document.getElementById("lang-toggle").setAttribute("aria-pressed", "true");
    } else {
      document.body.classList.remove("lang-he");
      document.documentElement.setAttribute("lang", "en");
      document.documentElement.setAttribute("dir", "ltr");
      document.getElementById("lang-toggle").setAttribute("aria-pressed", "false");
    }

    // Toggle the `hidden` attribute on all language spans so that
    // [hidden] { display: none !important } doesn't block CSS language rules.
    document.querySelectorAll(".lang-he").forEach(el => el.toggleAttribute("hidden", !state.isHebrew));
    document.querySelectorAll(".lang-en").forEach(el => el.toggleAttribute("hidden", state.isHebrew));

    // Name spans are independent of UI language: show Hebrew names when
    // either full-Hebrew mode is active or the Hebrew-names toggle is on.
    const showHebrewNames = state.isHebrew || state.hebrewNames;
    document.querySelectorAll(".name-he").forEach(el => el.toggleAttribute("hidden", !showHebrewNames));
    document.querySelectorAll(".name-en").forEach(el => el.toggleAttribute("hidden",  showHebrewNames));
  }

  function toggle() {
    state.isHebrew = !state.isHebrew;
    applyLanguage();
  }

  return { toggle, applyLanguage };
})();

/* ============================================================
   6. SHARE — Encode / decode state as a URL GET parameter
   ============================================================ */

const Share = (() => {
  const PARAM = "s";

  /**
   * Serialises the current user inputs into a plain object,
   * JSON-encodes it, then base64url-encodes the result.
   * Only primitive/whitelisted values are included — no HTML, no DOM.
   */
  function encode() {
    const payload = {
      mode:      state.scheduleMode,
      pace:      state.dailyPace,
      date:      (() => {
                   if (state.scheduleMode !== "target-date") return null;
                   // Read directly from the input to avoid UTC timezone shift
                   const v = document.getElementById("target-date").value;
                   return v || null;
                 })(),
      sedarim:   Array.from(state.selectedSedarim),
      counts:    state.completedCounts,
      hebrew:    state.isHebrew,
      heNames:   state.hebrewNames,
    };
    const json = JSON.stringify(payload);
    // btoa requires a binary string; encode via encodeURIComponent first.
    return btoa(unescape(encodeURIComponent(json)));
  }

  /**
   * Decodes the base64url parameter and validates every field strictly
   * before touching any DOM or state.  No value from the URL is ever
   * inserted as HTML — only assigned to typed state properties or
   * set as .value / .checked on specific inputs.
   *
   * @returns {object|null} validated payload or null on any error
   */
  function decode(encoded) {
    try {
      const json = decodeURIComponent(escape(atob(encoded)));
      const p = JSON.parse(json);

      // --- strict validation of every field ---
      if (typeof p !== "object" || p === null) return null;

      // scheduleMode
      if (p.mode !== "daily-pace" && p.mode !== "target-date") return null;

      // dailyPace: integer 1–500
      const pace = parseInt(p.pace, 10);
      if (!Number.isInteger(pace) || pace < 1 || pace > 500) return null;

      // targetDate: YYYY-MM-DD or null
      let targetDate = null;
      if (p.date !== null) {
        if (typeof p.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) return null;
        targetDate = new Date(p.date + "T00:00:00");
        if (isNaN(targetDate.getTime())) return null;
      }

      // selectedSedarim: array of valid seder indices
      if (!Array.isArray(p.sedarim)) return null;
      const maxSederIdx = MISHNA_DATA.sedarim.length - 1;
      const sedarim = new Set();
      for (const idx of p.sedarim) {
        if (!Number.isInteger(idx) || idx < 0 || idx > maxSederIdx) return null;
        sedarim.add(idx);
      }

      // completedCounts: object with "N-N" keys and integer values
      if (typeof p.counts !== "object" || p.counts === null || Array.isArray(p.counts)) return null;
      const counts = {};
      for (const [key, val] of Object.entries(p.counts)) {
        // key must match "sederIdx-mesechtaIdx" for a real mesechta
        if (!/^\d+-\d+$/.test(key)) return null;
        const [si, mi] = key.split("-").map(Number);
        const mesechta = ALL_MASECHTOS.find(m => m.sederIdx === si && m.mesechtaIdx === mi);
        if (!mesechta) return null;
        const count = parseInt(val, 10);
        if (!Number.isInteger(count) || count < 0 || count > mesechta.mishnayos_count) return null;
        counts[key] = count;
      }

      // boolean flags
      const isHebrew  = p.hebrew  === true;
      const hebrewNames = p.heNames === true;

      return { mode: p.mode, pace, targetDate, sedarim, counts, isHebrew, hebrewNames };
    } catch (_) {
      return null;
    }
  }

  /**
   * Applies a decoded payload to the app state and DOM inputs.
   * Must be called after renderSederGoalCheckboxes() so inputs exist.
   */
  function applyPayload(payload) {
    state.scheduleMode  = payload.mode;
    state.dailyPace     = payload.pace;
    state.targetDate    = payload.targetDate;
    state.selectedSedarim = payload.sedarim;
    state.completedCounts = payload.counts;
    state.isHebrew      = payload.isHebrew;
    state.hebrewNames   = payload.hebrewNames;

    // Sync DOM inputs — all assignments go through .value / .checked, never innerHTML
    const modeRadio = document.querySelector(`input[name="schedule-mode"][value="${payload.mode}"]`);
    if (modeRadio) modeRadio.checked = true;

    document.getElementById("daily-pace").value = String(payload.pace);

    if (payload.targetDate) {
      document.getElementById("target-date").value = payload.targetDate.toISOString().split("T")[0];
    }

    const nameLangVal = payload.hebrewNames ? "hebrew" : "english";
    const nameLangRadio = document.querySelector(`input[name="name-lang"][value="${nameLangVal}"]`);
    if (nameLangRadio) nameLangRadio.checked = true;

    // Seder checkboxes
    MISHNA_DATA.sedarim.forEach((_, idx) => {
      const cb = document.getElementById(`sg-${idx}`);
      if (cb) cb.checked = payload.sedarim.has(idx);
    });

    // Mesechta number inputs
    for (const [key, count] of Object.entries(payload.counts)) {
      const input = document.getElementById(`mc-${key}`);
      if (input) input.value = String(count);
    }
  }

  /** Builds a shareable URL and copies it to the clipboard. */
  function copyShareLink() {
    const encoded = encode();
    const url = new URL(window.location.href);
    url.search = "";          // clear any existing params
    url.searchParams.set(PARAM, encoded);

    const shareBtn = document.getElementById("share-schedule");

    navigator.clipboard.writeText(url.toString()).then(() => {
      const originalText = shareBtn.querySelector(".lang-en").textContent;
      shareBtn.querySelector(".lang-en").textContent = "Link Copied!";
      shareBtn.querySelector(".lang-he").textContent = "הקישור הועתק!";
      setTimeout(() => {
        shareBtn.querySelector(".lang-en").textContent = originalText;
        shareBtn.querySelector(".lang-he").textContent = "שתף לוח זמנים";
      }, 2000);
    }).catch(() => {
      // Fallback: prompt with URL for browsers that block clipboard access
      window.prompt("Copy this link:", url.toString());
    });
  }

  /**
   * Reads the URL parameter on page load, decodes and validates it,
   * then returns the payload (or null).
   */
  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get(PARAM);
    if (!encoded) return null;
    return decode(encoded);
  }

  return { copyShareLink, loadFromUrl, applyPayload };
})();

/* ============================================================
   7. PDF — Export via browser print dialog
   ============================================================ */

const PDF = (() => {
  function exportSchedule() {
    const scheduleEl   = document.getElementById("schedule-section");
    const mesechtaEl  = document.getElementById("mesechta-dates-section");
    const scheduleWasHidden  = scheduleEl.hidden;
    const mesechtaWasHidden  = mesechtaEl.hidden;

    // Temporarily reveal both result sections so [hidden] { display:none !important }
    // doesn't suppress them during printing.
    scheduleEl.hidden  = false;
    mesechtaEl.hidden  = false;

    function restore() {
      scheduleEl.hidden  = scheduleWasHidden;
      mesechtaEl.hidden  = mesechtaWasHidden;
      window.removeEventListener("afterprint", restore);
    }
    window.addEventListener("afterprint", restore);
    window.print();
  }
  return { exportSchedule };
})();

/* ============================================================
   7. MAIN — Init & event wiring
   ============================================================ */

const Main = (() => {

  /** Reads all mesechta input values from the DOM into state */
  function syncGridInputsToState() {
    document.querySelectorAll("[data-key]").forEach(input => {
      const key = input.dataset.key;
      const value = parseInt(input.value, 10);
      state.completedCounts[key] = isNaN(value) || value < 0 ? 0 : value;
    });
  }

  /**
   * Renders per-seder expandable disclosure widgets inside #seder-goals-list.
   * Each disclosure has: goal checkbox, seder name, progress text,
   * a toggle button, a mini progress bar, and mesechta cards inside.
   */
  function renderSederGoalCheckboxes() {
    const container = document.getElementById("seder-goals-list");
    if (!container) return;
    container.innerHTML = "";

    MISHNA_DATA.sedarim.forEach((seder, idx) => {
      // Compute seder-level progress
      const sederMasechtos = ALL_MASECHTOS.filter(m => m.sederIdx === idx);
      const sederTotal = sederMasechtos.reduce((sum, m) => sum + m.mishnayos_count, 0);
      const sederCompleted = sederMasechtos.reduce(
        (sum, m) => sum + Calculator.getCompleted(m.sederIdx, m.mesechtaIdx), 0
      );
      const sederPct = Math.round((sederCompleted / sederTotal) * 100);
      const countStr = `${sederCompleted} / ${sederTotal}`;

      const panelId    = `seder-masechtos-${idx}`;
      const barWrapId  = `seder-bar-wrap-${idx}`;
      const barFillId  = `seder-mini-bar-${idx}`;
      const textId     = `seder-progress-text-${idx}`;

      /* --- Outer wrapper --- */
      const disclosure = document.createElement("div");
      disclosure.className = "seder-disclosure";

      /* --- Header row --- */
      const header = document.createElement("div");
      header.className = "seder-disclosure-header";

      // Goal-inclusion checkbox + seder name
      const goalLabel = document.createElement("label");
      goalLabel.className = "checkbox-label seder-goal-label";
      goalLabel.htmlFor = `sg-${idx}`;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = `sg-${idx}`;
      cb.checked = state.selectedSedarim.has(idx);
      cb.dataset.sederGoal = String(idx);
      cb.setAttribute("aria-label", `Include ${seder.seder_en} in study goal`);
      cb.addEventListener("change", () => {
        if (cb.checked) state.selectedSedarim.add(idx);
        else state.selectedSedarim.delete(idx);
        Renderer.renderProgressSummary();
        Renderer.hideResults();
      });

      const nameSpan = document.createElement("span");
      const showHebrewNamesNow = state.isHebrew || state.hebrewNames;
      nameSpan.innerHTML = `<span class="name-en"${showHebrewNamesNow ? " hidden" : ""}>${seder.seder_en}</span><span class="name-he"${showHebrewNamesNow ? "" : " hidden"}>${seder.seder_he}</span>`;

      goalLabel.appendChild(cb);
      goalLabel.appendChild(nameSpan);

      // Progress text (e.g. "12 / 655")
      const progressText = document.createElement("span");
      progressText.className = "seder-progress-text";
      progressText.id = textId;
      progressText.setAttribute("aria-live", "polite");
      progressText.innerHTML = `<span class="lang-en">${countStr}</span><span class="lang-he" ${state.isHebrew ? "" : "hidden"}>${countStr}</span>`;

      // Toggle button
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "seder-toggle-btn";
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-controls", panelId);
      toggleBtn.innerHTML = `<span class="toggle-icon" aria-hidden="true">▼</span><span class="sr-only">${seder.seder_en} masechtos</span>`;
      toggleBtn.addEventListener("click", () => {
        const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
        toggleBtn.setAttribute("aria-expanded", String(!isExpanded));
        panel.hidden = isExpanded;
      });

      header.appendChild(goalLabel);
      header.appendChild(progressText);
      header.appendChild(toggleBtn);

      /* --- Seder-level mini progress bar --- */
      const barWrap = document.createElement("div");
      barWrap.className = "seder-mini-bar-wrap";
      barWrap.id = barWrapId;
      barWrap.setAttribute("role", "progressbar");
      barWrap.setAttribute("aria-valuenow", sederPct);
      barWrap.setAttribute("aria-valuemin", "0");
      barWrap.setAttribute("aria-valuemax", "100");
      barWrap.setAttribute("aria-label", `${seder.seder_en} progress ${sederPct}%`);
      const barFill = document.createElement("div");
      barFill.className = "seder-mini-bar-fill";
      barFill.id = barFillId;
      barFill.style.width = `${sederPct}%`;
      barWrap.appendChild(barFill);

      /* --- Masechtos panel (hidden by default) --- */
      const panel = document.createElement("div");
      panel.className = "seder-masechtos masechtos-grid";
      panel.id = panelId;
      panel.hidden = true;

      // Build a mesechta card for every mesechta in this seder
      sederMasechtos.forEach(m => {
        const key = `${m.sederIdx}-${m.mesechtaIdx}`;
        const completed = Calculator.getCompleted(m.sederIdx, m.mesechtaIdx);
        const pct = Math.round((completed / m.mishnayos_count) * 100);
        const isDone = completed >= m.mishnayos_count;

        const card = document.createElement("article");
        card.className = `mesechta-card${isDone ? " completed" : ""}`;
        card.setAttribute("aria-label", `${m.name_en}: ${completed} of ${m.mishnayos_count} completed`);

        const showHebNow = state.isHebrew || state.hebrewNames;
        card.innerHTML = `
          <div class="mesechta-name name-en"${showHebNow ? " hidden" : ""}>${m.name_en}</div>
          <div class="mesechta-name mesechta-name-he name-he"${showHebNow ? "" : " hidden"}>${m.name_he}</div>
          <div class="mesechta-count lang-en">${m.mishnayos_count} Mishnayos</div>
          <div class="mesechta-count lang-he" ${state.isHebrew ? "" : "hidden"}>${m.mishnayos_count} משניות</div>
          <label class="mesechta-complete-wrap checkbox-label" for="mc-done-${key}">
            <input
              type="checkbox"
              id="mc-done-${key}"
              data-complete-key="${key}"
              ${isDone ? "checked" : ""}
              aria-label="Mark ${m.name_en} as fully complete"
            />
            <span class="lang-en">Mark complete</span>
            <span class="lang-he" ${state.isHebrew ? "" : "hidden"}>סמן כהושלם</span>
          </label>
          <div class="mesechta-input-wrap">
            <label for="mc-${key}">
              <span class="lang-en">Completed (#)</span>
              <span class="lang-he" ${state.isHebrew ? "" : "hidden"}>מספר שהושלם</span>
            </label>
            <input
              type="number"
              id="mc-${key}"
              data-key="${key}"
              min="0"
              max="${m.mishnayos_count}"
              step="1"
              value="${completed}"
              aria-label="Completed Mishnayos in ${m.name_en}, max ${m.mishnayos_count}"
            />
          </div>
          <div class="mesechta-mini-bar-wrap" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${m.name_en} progress ${pct}%">
            <div class="mesechta-mini-bar-fill" style="width:${pct}%"></div>
          </div>
        `;
        panel.appendChild(card);
      });

      disclosure.appendChild(header);
      disclosure.appendChild(barWrap);
      disclosure.appendChild(panel);
      container.appendChild(disclosure);
    });
  }

  /** Attaches change listeners to all mesechta number inputs and complete checkboxes in the grid */
  function attachGridInputListeners() {
    // Number inputs
    document.querySelectorAll("[data-key]").forEach(input => {
      input.addEventListener("input", () => {
        const key = input.dataset.key;
        const [si, mi] = key.split("-").map(Number);
        const mesechta = ALL_MASECHTOS.find(m => m.sederIdx === si && m.mesechtaIdx === mi);
        if (!mesechta) return;

        let value = parseInt(input.value, 10);
        if (isNaN(value) || value < 0) value = 0;
        if (value > mesechta.mishnayos_count) value = mesechta.mishnayos_count;

        state.completedCounts[key] = value;
        input.value = value;

        const pct = Math.round((value / mesechta.mishnayos_count) * 100);
        const card = input.closest(".mesechta-card");
        if (card) {
          const bar = card.querySelector(".mesechta-mini-bar-fill");
          if (bar) bar.style.width = `${pct}%`;

          const barWrap = card.querySelector(".mesechta-mini-bar-wrap");
          if (barWrap) barWrap.setAttribute("aria-valuenow", pct);

          if (value >= mesechta.mishnayos_count) {
            card.classList.add("completed");
          } else {
            card.classList.remove("completed");
          }
          card.setAttribute("aria-label", `${mesechta.name_en}: ${value} of ${mesechta.mishnayos_count} completed`);

          // Sync the "mark complete" checkbox
          const completeCheckbox = card.querySelector("[data-complete-key]");
          if (completeCheckbox) {
            completeCheckbox.checked = value >= mesechta.mishnayos_count;
          }
        }

        Renderer.renderProgressSummary();
        Renderer.hideResults();
      });
    });

    // Mark-complete checkboxes
    document.querySelectorAll("[data-complete-key]").forEach(cb => {
      cb.addEventListener("change", () => {
        const key = cb.dataset.completeKey;
        const [si, mi] = key.split("-").map(Number);
        const mesechta = ALL_MASECHTOS.find(m => m.sederIdx === si && m.mesechtaIdx === mi);
        if (!mesechta) return;

        const value = cb.checked ? mesechta.mishnayos_count : 0;
        state.completedCounts[key] = value;

        // Sync the number input
        const numInput = document.getElementById(`mc-${key}`);
        if (numInput) numInput.value = value;

        const pct = cb.checked ? 100 : 0;
        const card = cb.closest(".mesechta-card");
        if (card) {
          const bar = card.querySelector(".mesechta-mini-bar-fill");
          if (bar) bar.style.width = `${pct}%`;
          const barWrap = card.querySelector(".mesechta-mini-bar-wrap");
          if (barWrap) barWrap.setAttribute("aria-valuenow", pct);
          if (cb.checked) card.classList.add("completed");
          else card.classList.remove("completed");
          card.setAttribute("aria-label", `${mesechta.name_en}: ${value} of ${mesechta.mishnayos_count} completed`);
        }

        Renderer.renderProgressSummary();
        Renderer.hideResults();
      });
    });
  }

  /** Handles schedule mode radio button changes */
  function handleModeChange() {
    const panelDate = document.getElementById("panel-date");
    const panelPace = document.getElementById("panel-pace");
    const mode = document.querySelector('input[name="schedule-mode"]:checked').value;
    state.scheduleMode = mode;

    if (mode === "target-date") {
      panelDate.hidden = false;
      panelPace.hidden = true;
    } else {
      panelDate.hidden = true;
      panelPace.hidden = false;
    }
  }

  /** Handles form submission: validate → compute → render */
  function handleGenerate(e) {
    e.preventDefault();
    Renderer.clearErrors();

    // Validate seder goal selection
    if (state.selectedSedarim.size === 0) {
      const errEl = document.getElementById("seder-goal-error");
      if (errEl) {
        errEl.textContent = state.isHebrew
          ? "בחר לפחות סדר אחד כמטרה."
          : "Please select at least one Seder as your goal.";
        errEl.hidden = false;
      }
      return;
    }

    // Read target date / daily pace from inputs
    if (state.scheduleMode === "target-date") {
      const rawDate = document.getElementById("target-date").value;
      if (!rawDate) {
        Renderer.showError(Renderer.els.targetDateError, "Please select a target completion date.");
        document.getElementById("target-date").classList.add("invalid");
        document.getElementById("target-date").focus();
        return;
      }
      state.targetDate = new Date(rawDate + "T00:00:00");
    } else {
      const rawPace = document.getElementById("daily-pace").value;
      const pace = parseInt(rawPace, 10);
      if (isNaN(pace) || pace < 1) {
        Renderer.showError(Renderer.els.dailyPaceError, "Please enter a valid daily pace (minimum 1).");
        document.getElementById("daily-pace").classList.add("invalid");
        document.getElementById("daily-pace").focus();
        return;
      }
      state.dailyPace = pace;
    }

    // Sync any unsaved inputs
    syncGridInputsToState();

    const { ok, error, result } = Calculator.compute();

    if (!ok) {
      if (state.scheduleMode === "target-date") {
        Renderer.showError(Renderer.els.targetDateError, error);
        document.getElementById("target-date").classList.add("invalid");
      } else {
        Renderer.showError(Renderer.els.dailyPaceError, error);
        document.getElementById("daily-pace").classList.add("invalid");
      }
      return;
    }

    if (result.done) {
      Renderer.renderDashboard(result);
      Renderer.setVisible(Renderer.els.mesechtaDatesSection, false);
      document.getElementById("export-pdf").hidden = false;
      document.getElementById("share-schedule").hidden = false;
      return;
    }

    Renderer.renderDashboard(result);
    Renderer.renderCalcSummary(result);
    Renderer.renderMesechtaTable(result.mesechtaProjections);
    document.getElementById("export-pdf").hidden = false;
    document.getElementById("share-schedule").hidden = false;

    // Scroll down until the form-actions row is just below the sticky header,
    // but only if we need to scroll down — never scroll back up.
    const formActions = document.querySelector(".form-actions");
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;
    const targetScrollY = formActions.getBoundingClientRect().top + window.scrollY - headerHeight;
    if (window.scrollY < targetScrollY) {
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    }
  }

  /** Resets all progress and clears the UI */
  function handleReset() {
    document.getElementById("export-pdf").hidden = true;
    document.getElementById("share-schedule").hidden = true;
    state.completedCounts = {};
    state.targetDate = null;
    state.dailyPace = 3;
    state.scheduleMode = "daily-pace";
    state.activeSederIndex = -1;
    state.hebrewNames = false;
    // Reset goal to all sedarim selected
    state.selectedSedarim = new Set(MISHNA_DATA.sedarim.map((_, i) => i));

    // Reset form fields
    document.getElementById("target-date").value = "";
    document.getElementById("daily-pace").value = "3";
    document.querySelector('input[name="schedule-mode"][value="daily-pace"]').checked = true;
    document.querySelector('input[name="name-lang"][value="english"]').checked = true;
    handleModeChange();

    Renderer.clearErrors();
    renderSederGoalCheckboxes();
    attachGridInputListeners();
    Renderer.renderProgressSummary();
    Renderer.hideResults();
  }

  /** Initialises the app */
  function init() {
    // Set default active seder to "All"
    state.activeSederIndex = -1;

    // Render static UI
    renderSederGoalCheckboxes();
    attachGridInputListeners();

    // Set min date for target date input to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    document.getElementById("target-date").min = tomorrowStr;

    /* ---- Event Listeners ---- */

    // Schedule mode radio buttons
    document.querySelectorAll('input[name="schedule-mode"]').forEach(radio => {
      radio.addEventListener("change", handleModeChange);
    });

    // Form submit (Generate Schedule)
    document.getElementById("settings-form").addEventListener("submit", handleGenerate);

    // Reset button
    document.getElementById("reset-btn").addEventListener("click", handleReset);

    // Language toggle
    document.getElementById("lang-toggle").addEventListener("click", Language.toggle);

    // Name language radios
    document.querySelectorAll('input[name="name-lang"]').forEach(radio => {
      radio.addEventListener("change", () => {
        // Preserve which seder panels are currently expanded
        const expandedSeders = new Set();
        MISHNA_DATA.sedarim.forEach((_, idx) => {
          const panel = document.getElementById(`seder-masechtos-${idx}`);
          if (panel && !panel.hidden) expandedSeders.add(idx);
        });

        state.hebrewNames = document.querySelector('input[name="name-lang"]:checked').value === "hebrew";
        Language.applyLanguage();
        Main.renderSederGoalCheckboxes();
        Main.attachGridInputListeners();

        // Restore expanded state
        expandedSeders.forEach(idx => {
          const panel = document.getElementById(`seder-masechtos-${idx}`);
          const toggleBtn = document.querySelector(`[aria-controls="seder-masechtos-${idx}"]`);
          if (panel && toggleBtn) {
            panel.hidden = false;
            toggleBtn.setAttribute("aria-expanded", "true");
          }
        });
      });
    });

    // PDF export
    document.getElementById("export-pdf").addEventListener("click", PDF.exportSchedule);

    // Share schedule
    document.getElementById("share-schedule").addEventListener("click", Share.copyShareLink);

    // Load shared state from URL AFTER all event listeners are attached,
    // so requestSubmit() correctly triggers handleGenerate.
    const sharedPayload = Share.loadFromUrl();
    if (sharedPayload) {
      Share.applyPayload(sharedPayload);
      Language.applyLanguage();
      handleModeChange();
      Renderer.renderProgressSummary();
      document.getElementById("settings-form").requestSubmit();
    } else {
      Renderer.renderProgressSummary();
    }
  }

  return { init, attachGridInputListeners, renderSederGoalCheckboxes };
})();

/* ============================================================
   Bootstrap — run after DOM is ready
   ============================================================ */
document.addEventListener("DOMContentLoaded", Main.init);
