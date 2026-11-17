/**
 * BLOOMY Analytics & Progress Tracking + Goals
 */
const BloomyAnalytics = (function () {
  function render() {
    const pageContent = document.getElementById("pageContent");
    if (!pageContent) return;
    const lang = window.currentLanguage || "id";

    const xp = BloomyStore.getXP();
    const level = BloomyStore.getLevel();
    const streak = BloomyStore.getStreak();
    const completed = BloomyStore.getCompletedLessons();
    const quizHist = BloomyStore.getQuizHistory();
    const avgScore = quizHist.length
      ? Math.round(quizHist.reduce((s, q) => s + (q.percent || 0), 0) / quizHist.length)
      : 0;
    const goals = BloomyStore.getGoals();
    const log = BloomyStore.getActivityLog().slice(0, 15);

    // Simple weekly activity counts
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const weekLog = BloomyStore.getActivityLog().filter(a => new Date(a.ts) >= weekAgo);
    const weekLessons = weekLog.filter(a => a.type === "lesson").length;
    const weekQuizzes = weekLog.filter(a => a.type === "quiz").length;
    const weekXP = weekLog.filter(a => a.type === "xp").reduce((s, a) => s + (a.data?.amount || 0), 0);

    pageContent.innerHTML = `
      <section class="welcome-row">
        <div>
          <div class="eyebrow"><span class="eyebrow-sparkle">▦</span><span>${lang === "id" ? "ANALITIK" : "ANALYTICS"}</span></div>
          <h1>${lang === "id" ? "Progres & Laporan" : "Progress & Reports"}</h1>
          <p class="welcome-subtitle">${lang === "id" ? "Pantau perjalanan belajarmu secara keseluruhan." : "Track your overall learning journey."}</p>
        </div>
      </section>

      <div class="stats-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:24px">
        <div class="card" style="padding:18px;text-align:center"><strong style="font-size:26px;color:var(--pink-dark)">${xp}</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">Total XP</p></div>
        <div class="card" style="padding:18px;text-align:center"><strong style="font-size:26px">${level}</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">${lang === "id" ? "Level" : "Level"}</p></div>
        <div class="card" style="padding:18px;text-align:center"><strong style="font-size:26px">${streak}</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">Streak</p></div>
        <div class="card" style="padding:18px;text-align:center"><strong style="font-size:26px">${completed.length}</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">${lang === "id" ? "Pelajaran" : "Lessons"}</p></div>
        <div class="card" style="padding:18px;text-align:center"><strong style="font-size:26px">${quizHist.length}</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">${lang === "id" ? "Kuis" : "Quizzes"}</p></div>
        <div class="card" style="padding:18px;text-align:center"><strong style="font-size:26px">${avgScore}%</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">${lang === "id" ? "Rata-rata skor" : "Avg score"}</p></div>
      </div>

      <div class="card" style="padding:20px;margin-bottom:20px">
        <h3 style="margin-top:0">${lang === "id" ? "Progres level" : "Level progress"}</h3>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
          <span>Level ${level}</span>
          <span>${xp % 100} / 100 XP</span>
        </div>
        <div class="progress-bar" style="height:12px;background:var(--line);border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${xp % 100}%;background:linear-gradient(90deg,var(--pink),#f5b0c8);border-radius:99px;transition:width .4s"></div>
        </div>
      </div>

      <div class="card" style="padding:20px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h3 style="margin:0">${lang === "id" ? "Tujuan belajar" : "Learning goals"}</h3>
          <button class="primary-btn" id="addGoalBtn" style="padding:8px 14px;font-size:13px">＋ ${lang === "id" ? "Tambah" : "Add"}</button>
        </div>
        <div id="goalsList"></div>
      </div>

      <div class="card" style="padding:20px;margin-bottom:20px">
        <h3 style="margin-top:0">${lang === "id" ? "Laporan 7 hari terakhir" : "Last 7 days report"}</h3>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center">
          <div><strong style="font-size:20px">${weekLessons}</strong><p style="font-size:12px;color:var(--muted);margin:4px 0 0">${lang === "id" ? "Pelajaran" : "Lessons"}</p></div>
          <div><strong style="font-size:20px">${weekQuizzes}</strong><p style="font-size:12px;color:var(--muted);margin:4px 0 0">${lang === "id" ? "Kuis" : "Quizzes"}</p></div>
          <div><strong style="font-size:20px">${weekXP}</strong><p style="font-size:12px;color:var(--muted);margin:4px 0 0">XP</p></div>
        </div>
      </div>

      <div class="card" style="padding:20px">
        <h3 style="margin-top:0">${lang === "id" ? "Riwayat aktivitas" : "Activity history"}</h3>
        <div id="activityList" style="display:flex;flex-direction:column;gap:8px"></div>
      </div>
    `;

    renderGoals(goals, lang);
    renderActivity(log, lang);

    document.getElementById("addGoalBtn").onclick = () => {
      const title = prompt(lang === "id" ? "Judul tujuan (contoh: Selesaikan 3 pelajaran minggu ini)" : "Goal title (e.g. Complete 3 lessons this week)");
      if (!title) return;
      const target = Number(prompt(lang === "id" ? "Target angka (contoh: 3)" : "Target number (e.g. 3)", "3")) || 1;
      const goals = BloomyStore.getGoals();
      goals.unshift({
        id: "g_" + Date.now(),
        title,
        target,
        current: 0,
        type: "custom",
        created: new Date().toISOString()
      });
      BloomyStore.saveGoals(goals);
      render();
    };
  }

  function renderGoals(goals, lang) {
    const el = document.getElementById("goalsList");
    if (!el) return;
    if (!goals.length) {
      el.innerHTML = `<p style="color:var(--muted);font-size:13px">${lang === "id" ? "Belum ada tujuan. Buat satu untuk tetap termotivasi!" : "No goals yet. Create one to stay motivated!"}</p>`;
      return;
    }
    el.innerHTML = goals.map(g => {
      const pct = Math.min(100, Math.round((g.current / g.target) * 100));
      return `
        <div style="margin-bottom:14px;padding:12px;background:var(--pink-soft);border-radius:14px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <strong style="font-size:14px">${escapeHtml(g.title)}</strong>
            <button class="icon-button delete-goal" data-id="${g.id}" style="font-size:12px">🗑</button>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:4px">
            <span>${g.current} / ${g.target}</span>
            <span>${pct}%</span>
          </div>
          <div style="height:8px;background:#fff;border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--pink);border-radius:99px"></div>
          </div>
          <div style="margin-top:8px">
            <button class="text-link inc-goal" data-id="${g.id}">＋ ${lang === "id" ? "Tambah progres" : "Add progress"}</button>
          </div>
        </div>
      `;
    }).join("");

    el.querySelectorAll(".delete-goal").forEach(btn => {
      btn.onclick = () => {
        const goals = BloomyStore.getGoals().filter(g => g.id !== btn.dataset.id);
        BloomyStore.saveGoals(goals);
        render();
      };
    });
    el.querySelectorAll(".inc-goal").forEach(btn => {
      btn.onclick = () => {
        const goals = BloomyStore.getGoals();
        const g = goals.find(x => x.id === btn.dataset.id);
        if (g) {
          g.current = Math.min(g.target, (g.current || 0) + 1);
          BloomyStore.saveGoals(goals);
          if (g.current >= g.target && typeof showToast === "function") {
            showToast(lang === "id" ? "Tujuan tercapai! 🎉" : "Goal completed! 🎉");
            BloomyStore.addXP(20, "goal_" + g.id);
          }
          render();
        }
      };
    });
  }

  function renderActivity(log, lang) {
    const el = document.getElementById("activityList");
    if (!el) return;
    if (!log.length) {
      el.innerHTML = `<p style="color:var(--muted);font-size:13px">${lang === "id" ? "Belum ada aktivitas." : "No activity yet."}</p>`;
      return;
    }
    const labels = {
      lesson: lang === "id" ? "Menyelesaikan pelajaran" : "Completed a lesson",
      quiz: lang === "id" ? "Menyelesaikan kuis" : "Completed a quiz",
      xp: lang === "id" ? "Mendapat XP" : "Earned XP",
      achievement: lang === "id" ? "Membuka pencapaian" : "Unlocked achievement",
      checkin: lang === "id" ? "Check-in harian" : "Daily check-in"
    };
    el.innerHTML = log.map(a => {
      const d = new Date(a.ts);
      const time = d.toLocaleString(lang === "id" ? "id-ID" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      let detail = "";
      if (a.type === "xp") detail = `+${a.data?.amount || 0} XP`;
      if (a.type === "quiz") detail = `${a.data?.percent || 0}%`;
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--line);font-size:13px">
        <span>${labels[a.type] || a.type} ${detail ? "· " + detail : ""}</span>
        <small style="color:var(--muted)">${time}</small>
      </div>`;
    }).join("");
  }

  function escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  return { render };
})();
