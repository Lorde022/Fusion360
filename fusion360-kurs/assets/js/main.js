/* =========================================================
   Fusion 360 Kurs – clientseitige Logik
   - Theme Toggle (auto / light / dark) mit localStorage
   - Fortschritts-Tracking pro Lektion
   - Modul-Übersicht auf der Index-Seite
   - Lesson-Navigation, Mark-as-complete, Pager
   - Suche (clientseitig)
   ========================================================= */

(function () {
  "use strict";

  const PROGRESS_KEY = "fusion360-kurs:progress:v1";
  const THEME_KEY    = "fusion360-kurs:theme";

  /* ---------- Pfad-Helfer (relative URLs aus jeder Tiefe) ---------- */
  function rootPath() {
    // Sucht nach "module/" oder "/index.html" um Tiefe zu bestimmen
    const path = location.pathname;
    if (path.includes("/module/")) return "../../";
    return "";
  }

  /* ---------- Theme ---------- */
  function getStoredTheme() { return localStorage.getItem(THEME_KEY) || "auto"; }
  function applyTheme(t) { document.documentElement.setAttribute("data-theme", t); }
  function cycleTheme(cur) { return cur === "auto" ? "light" : cur === "light" ? "dark" : "auto"; }

  applyTheme(getStoredTheme());
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    const next = cycleTheme(getStoredTheme());
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    btn.setAttribute("aria-label", "Farbschema (aktuell: " + next + ")");
  });

  /* ---------- Progress ---------- */
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
    catch { return {}; }
  }
  function saveProgress(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); }
  function markLesson(key, done) {
    const p = loadProgress();
    if (done) p[key] = { at: Date.now() };
    else delete p[key];
    saveProgress(p);
  }

  /* ---------- Index-Seite ---------- */
  function renderIndex() {
    const host = document.getElementById("modules");
    if (!host || !window.CURRICULUM) return;

    const progress = loadProgress();
    const flat = window.CURRICULUM.flat;
    const totalDone = flat.filter(l => progress[l.key]).length;

    // Overall progress
    const overallText = document.querySelector("[data-overall-text]");
    const overallBar  = document.querySelector("[data-overall-bar] .progress__fill");
    const overallRole = document.querySelector("[data-overall-bar]");
    if (overallText) overallText.textContent = `${totalDone} / ${flat.length} Lektionen`;
    if (overallBar)  overallBar.style.width = (flat.length ? (totalDone / flat.length * 100) : 0) + "%";
    if (overallRole) overallRole.setAttribute("aria-valuenow", Math.round(totalDone / flat.length * 100));

    // Resume / Start
    const resume = document.querySelector("[data-resume]");
    const start  = document.querySelector("[data-start]");
    const firstUndone = flat.find(l => !progress[l.key]);
    if (firstUndone) {
      if (start) start.href = firstUndone.href;
      if (resume && totalDone > 0) {
        resume.href = firstUndone.href;
        resume.hidden = false;
      }
    } else if (totalDone === flat.length && totalDone > 0) {
      if (start) { start.textContent = "Kurs abgeschlossen 🎉"; start.href = flat[flat.length-1].href; }
    }

    // Reset
    const reset = document.querySelector("[data-reset]");
    if (reset) reset.addEventListener("click", () => {
      if (confirm("Allen Fortschritt wirklich zurücksetzen?")) {
        localStorage.removeItem(PROGRESS_KEY);
        location.reload();
      }
    });

    // Module cards
    host.innerHTML = window.CURRICULUM.modules.map((m) => {
      const lessonItems = m.lessons.map((l, i) => {
        const key = `${m.id}/${i + 1}-${l.id}`;
        const done = !!progress[key];
        const href = `module/${m.id}/${i + 1}-${l.id}.html`;
        return `<li class="${done ? "done" : ""}" data-key="${key}">
          <a href="${href}">
            <span class="check" aria-hidden="true">${done ? "✓" : ""}</span>
            <span>${escapeHtml(l.title)}</span>
          </a>
        </li>`;
      }).join("");

      const totalMin = m.lessons.reduce((s, l) => s + l.minutes, 0);
      const doneCount = m.lessons.filter((l, i) => progress[`${m.id}/${i + 1}-${l.id}`]).length;
      const pct = Math.round(doneCount / m.lessons.length * 100);

      return `<article class="module" data-module-id="${m.id}">
        <header class="module__head">
          <span class="module__num">Modul ${m.number}</span>
          <span class="module__num">${doneCount}/${m.lessons.length}</span>
        </header>
        <h2 class="module__title">${escapeHtml(m.title)}</h2>
        <p class="module__desc">${escapeHtml(m.description)}</p>
        <div class="progress" aria-label="Fortschritt Modul ${m.number}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
          <div class="progress__fill" style="width:${pct}%"></div>
        </div>
        <ul class="module__lessons">${lessonItems}</ul>
        <div class="module__meta">
          <span>${m.lessons.length} Lektionen</span>
          <span>~${Math.round(totalMin / 60 * 10) / 10} h</span>
        </div>
      </article>`;
    }).join("");

    // Suche (clientseitig: einfache Substring-Filterung der Karten/Lektionen)
    const search = document.getElementById("search");
    if (search) {
      search.addEventListener("input", () => {
        const q = search.value.trim().toLowerCase();
        host.querySelectorAll(".module").forEach((card) => {
          const lessons = card.querySelectorAll(".module__lessons li");
          let anyMatch = !q;
          lessons.forEach((li) => {
            const t = li.textContent.toLowerCase();
            const hit = !q || t.includes(q);
            li.classList.toggle("is-hidden", !hit);
            if (hit) anyMatch = true;
          });
          card.classList.toggle("is-hidden", !anyMatch);
        });
      });
    }
  }

  /* ---------- Lesson-Seite ---------- */
  function renderLesson() {
    const article = document.querySelector("[data-lesson]");
    if (!article || !window.CURRICULUM) return;

    const moduleId = article.getAttribute("data-module");
    const lessonId = article.getAttribute("data-lesson");
    const lessonIndex = parseInt(article.getAttribute("data-lesson-index"), 10);
    const key = `${moduleId}/${lessonIndex}-${lessonId}`;

    const flat = window.CURRICULUM.flat;
    const me = flat.find(l => l.key === key);
    const myIndex = flat.indexOf(me);
    const prev = myIndex > 0 ? flat[myIndex - 1] : null;
    const next = myIndex < flat.length - 1 ? flat[myIndex + 1] : null;

    // Sidebar-Navigation aufbauen
    const navHost = document.getElementById("lesson-nav");
    if (navHost) {
      const progress = loadProgress();
      navHost.innerHTML = `<h2>Alle Module</h2>` + window.CURRICULUM.modules.map((m, mi) => {
        const isCurrent = m.id === moduleId;
        const items = m.lessons.map((l, i) => {
          const k = `${m.id}/${i + 1}-${l.id}`;
          const href = `../../module/${m.id}/${i + 1}-${l.id}.html`;
          const cur = (k === key) ? ' aria-current="page"' : "";
          const done = progress[k] ? ' class="done"' : "";
          return `<li${done}><a href="${href}"${cur}>${i + 1}. ${escapeHtml(l.title)}</a></li>`;
        }).join("");
        return `<details ${isCurrent ? "open" : ""}>
          <summary>Modul ${m.number}: ${escapeHtml(m.title)}</summary>
          <ul>${items}</ul>
        </details>`;
      }).join("");
    }

    // Mark-as-complete Toggle
    const toggle = document.querySelector("[data-complete-toggle]");
    if (toggle) {
      const update = () => {
        const done = !!loadProgress()[key];
        toggle.setAttribute("aria-pressed", String(done));
        toggle.textContent = done ? "✓ Erledigt" : "Als erledigt markieren";
      };
      update();
      toggle.addEventListener("click", () => {
        const done = !loadProgress()[key];
        markLesson(key, done);
        update();
      });
    }

    // Pager
    const pager = document.querySelector("[data-pager]");
    if (pager) {
      const prevHtml = prev
        ? `<a href="../../${prev.href}"><span class="label">← Vorherige</span><span>${escapeHtml(prev.title)}</span></a>`
        : `<span></span>`;
      const nextHtml = next
        ? `<a class="next" href="../../${next.href}"><span class="label">Nächste →</span><span>${escapeHtml(next.title)}</span></a>`
        : `<a class="next" href="../../index.html"><span class="label">↩ Zur Übersicht</span><span>Kurs abgeschlossen</span></a>`;
      pager.innerHTML = prevHtml + nextHtml;
    }

    // Breadcrumb-Daten
    const bcModule = document.querySelector("[data-bc-module]");
    if (bcModule) bcModule.textContent = `Modul ${me.moduleNumber}: ${me.moduleTitle}`;
  }

  /* ---------- helpers ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[c]));
  }

  /* ---------- run ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderIndex();
    renderLesson();
  });
})();
