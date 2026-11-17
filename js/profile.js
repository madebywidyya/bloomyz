/**
 * BLOOMY Profile & Settings Module
 */
const BloomyProfile = (function () {
  const AVATARS = ["🌸", "🌷", "🌼", "🌻", "🌺", "🍀", "⭐", "🌙", "🌈", "🦄", "🐱", "🐰"];

  function render() {
    const pageContent = document.getElementById("pageContent");
    if (!pageContent) return;
    const lang = window.currentLanguage || "id";
    const profile = BloomyStore.getProfile();
    const xp = BloomyStore.getXP();
    const level = BloomyStore.getLevel();
    const streak = BloomyStore.getStreak();
    const lessons = BloomyStore.getCompletedLessons().length;
    const quizzes = BloomyStore.getQuizHistory().length;

    pageContent.innerHTML = `
      <section class="welcome-row">
        <div>
          <div class="eyebrow"><span class="eyebrow-sparkle">☺</span><span>${lang === "id" ? "PROFIL" : "PROFILE"}</span></div>
          <h1>${lang === "id" ? "Profil belajar" : "Learning profile"}</h1>
        </div>
      </section>

      <div class="profile-hero card" style="padding:24px;display:flex;gap:20px;align-items:center;flex-wrap:wrap;margin-bottom:20px">
        <div class="avatar-big" style="font-size:56px;width:80px;height:80px;display:grid;place-items:center;background:var(--pink-soft);border-radius:24px">${profile.avatar || "🌸"}</div>
        <div style="flex:1;min-width:200px">
          <input type="text" id="profileNameInput" class="search-input" value="${escapeHtml(profile.name || "Guest learner")}" style="font-size:18px;font-weight:700;margin-bottom:8px;width:100%">
          <p style="color:var(--muted);font-size:13px;margin:0">${lang === "id" ? "Mode tamu · Data disimpan di perangkat ini" : "Guest mode · Data stored on this device"}</p>
        </div>
        <button class="primary-btn" id="saveProfileBtn">${lang === "id" ? "Simpan profil" : "Save profile"}</button>
      </div>

      <h3 style="margin:8px 0 12px">${lang === "id" ? "Pilih avatar" : "Choose avatar"}</h3>
      <div class="avatar-picker" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">
        ${AVATARS.map(a => `<button class="avatar-option ${a === profile.avatar ? "selected" : ""}" data-avatar="${a}" style="font-size:28px;width:48px;height:48px;border-radius:14px;border:2px solid ${a === profile.avatar ? "var(--pink)" : "var(--line)"};background:#fff">${a}</button>`).join("")}
      </div>

      <h3 style="margin:8px 0 12px">${lang === "id" ? "Statistik cepat" : "Quick stats"}</h3>
      <div class="stats-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:24px">
        <div class="card" style="padding:16px;text-align:center"><strong style="font-size:22px">${xp}</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">XP</p></div>
        <div class="card" style="padding:16px;text-align:center"><strong style="font-size:22px">${level}</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">Level</p></div>
        <div class="card" style="padding:16px;text-align:center"><strong style="font-size:22px">${streak}</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">Streak</p></div>
        <div class="card" style="padding:16px;text-align:center"><strong style="font-size:22px">${lessons}</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">${lang === "id" ? "Pelajaran" : "Lessons"}</p></div>
        <div class="card" style="padding:16px;text-align:center"><strong style="font-size:22px">${quizzes}</strong><p style="margin:4px 0 0;font-size:12px;color:var(--muted)">${lang === "id" ? "Kuis" : "Quizzes"}</p></div>
      </div>

      <div class="card" style="padding:20px">
        <h3 style="margin-top:0">${lang === "id" ? "Pengaturan & data" : "Settings & data"}</h3>
        <p style="color:var(--muted);font-size:13px;line-height:1.6">${lang === "id" ? "Progres, catatan, bookmark, dan statistik disimpan secara lokal di browser ini. Tidak ada sinkronisasi cloud pada versi awal." : "Progress, notes, bookmarks and stats are stored locally in this browser. No cloud sync in the initial version."}</p>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px">
          <button class="secondary-btn" id="resetProgressBtn">${lang === "id" ? "Reset semua progres" : "Reset all progress"}</button>
        </div>
      </div>
    `;

    let selectedAvatar = profile.avatar || "🌸";
    document.querySelectorAll(".avatar-option").forEach(btn => {
      btn.onclick = () => {
        selectedAvatar = btn.dataset.avatar;
        document.querySelectorAll(".avatar-option").forEach(b => {
          b.style.borderColor = b.dataset.avatar === selectedAvatar ? "var(--pink)" : "var(--line)";
          b.classList.toggle("selected", b.dataset.avatar === selectedAvatar);
        });
      };
    });

    document.getElementById("saveProfileBtn").onclick = () => {
      const name = document.getElementById("profileNameInput").value.trim() || "Guest learner";
      BloomyStore.saveProfile({ ...profile, name, avatar: selectedAvatar });
      const nameEl = document.getElementById("profileName");
      if (nameEl) nameEl.textContent = name;
      const avatarEl = document.querySelector(".profile-mini .avatar");
      if (avatarEl) avatarEl.textContent = selectedAvatar;
      if (typeof showToast === "function") showToast(lang === "id" ? "Profil disimpan ✓" : "Profile saved ✓");
    };

    document.getElementById("resetProgressBtn").onclick = () => {
      if (!confirm(lang === "id" ? "Yakin ingin mereset SEMUA progres, catatan, dan data? Tindakan ini tidak bisa dibatalkan." : "Reset ALL progress, notes and data? This cannot be undone.")) return;
      BloomyStore.resetAll();
      if (typeof showToast === "function") showToast(lang === "id" ? "Semua data direset" : "All data reset");
      render();
      if (typeof syncHomeXP === "function") syncHomeXP();
    };
  }

  function escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  return { render };
})();
