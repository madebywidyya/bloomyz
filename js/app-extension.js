/**
 * BLOOMY Stage 5 & 6 Extension
 * Hooks new pages into the existing SPA navigation.
 */
(function () {
  // Expose learning content if the main app has it embedded
  // The main app.js embeds content; we try to surface it for bookmarks.
  if (typeof learningContent === "undefined" && typeof subjectsData !== "undefined") {
    window.learningContent = subjectsData;
  }

  // Patch navigate if it exists, or provide a fallback
  const originalNavigate = window.navigate;
  window.navigate = function (page) {
    if (page === "notes") {
      setPageLabelSafe("notes");
      BloomyNotes.render();
      history.pushState(null, "", "#notes");
      return;
    }
    if (page === "bookmarks") {
      setPageLabelSafe("bookmarks");
      BloomyBookmarks.render();
      history.pushState(null, "", "#bookmarks");
      return;
    }
    if (page === "profile") {
      setPageLabelSafe("profile");
      BloomyProfile.render();
      history.pushState(null, "", "#profile");
      return;
    }
    if (page === "progress") {
      setPageLabelSafe("progress");
      BloomyAnalytics.render();
      history.pushState(null, "", "#progress");
      return;
    }
    if (typeof originalNavigate === "function") {
      return originalNavigate(page);
    }
    // Fallback for home etc.
    if (page === "home") {
      location.hash = "home";
      location.reload();
    }
  };

  function setPageLabelSafe(page) {
    const map = {
      home: "home",
      explore: "explore",
      quiz: "quiz",
      library: "library",
      garden: "garden",
      notes: "notes",
      bookmarks: "bookmarks",
      profile: "profile",
      progress: "progress"
    };
    const el = document.getElementById("pageName");
    if (el && typeof t === "function") {
      // extend t if needed
      el.textContent = t(map[page] || page) || page;
    } else if (el) {
      const labels = {
        notes: currentLanguage === "id" ? "Catatan" : "Notes",
        bookmarks: "Bookmarks",
        profile: currentLanguage === "id" ? "Profil" : "Profile",
        progress: currentLanguage === "id" ? "Progres" : "Progress"
      };
      el.textContent = labels[page] || page;
    }
    document.querySelectorAll(".nav-link").forEach((a) => {
      a.classList.toggle("active", a.dataset.page === page);
    });
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("open");
  }

  // Extend popstate
  window.addEventListener("popstate", () => {
    const h = location.hash.slice(1);
    if (h === "notes") BloomyNotes.render();
    else if (h === "bookmarks") BloomyBookmarks.render();
    else if (h === "profile") BloomyProfile.render();
    else if (h === "progress") BloomyAnalytics.render();
  });

  // Initial hash support for new pages
  const initial = location.hash.slice(1);
  if (initial === "notes") setTimeout(() => BloomyNotes.render(), 50);
  else if (initial === "bookmarks") setTimeout(() => BloomyBookmarks.render(), 50);
  else if (initial === "profile") setTimeout(() => BloomyProfile.render(), 50);
  else if (initial === "progress") setTimeout(() => BloomyAnalytics.render(), 50);

  // Hook lesson completion + bookmark button injection when lesson is rendered
  // We observe the page content for lesson pages
  const observer = new MutationObserver(() => {
    injectLessonExtras();
  });
  const pageContent = document.getElementById("pageContent");
  if (pageContent) {
    observer.observe(pageContent, { childList: true, subtree: true });
  }

  function injectLessonExtras() {
    const lessonActions = document.querySelector(".lesson-actions, .lesson-footer, .key-takeaways");
    if (!lessonActions) return;
    if (document.getElementById("bloomyExtraActions")) return;

    // Try to detect lesson id from hash
    const hash = location.hash.slice(1);
    if (!hash.startsWith("lesson-")) return;
    const lessonId = hash.slice(7);

    const wrap = document.createElement("div");
    wrap.id = "bloomyExtraActions";
    wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:10px;margin:16px 0";
    const lang = window.currentLanguage || "id";
    const done = BloomyStore.isLessonComplete(lessonId);
    const bookmarked = BloomyStore.isBookmarked(lessonId);

    wrap.innerHTML = `
      <button class="primary-btn" id="completeLessonBtn" ${done ? "disabled" : ""}>
        ${done ? (lang === "id" ? "✓ Sudah selesai (+15 XP)" : "✓ Completed (+15 XP)") : (lang === "id" ? "Tandai selesai (+15 XP)" : "Mark complete (+15 XP)")}
      </button>
      <button class="secondary-btn" id="bookmarkLessonBtn">
        ${bookmarked ? (lang === "id" ? "★ Tersimpan" : "★ Saved") : (lang === "id" ? "☆ Bookmark" : "☆ Bookmark")}
      </button>
    `;
    lessonActions.parentNode.insertBefore(wrap, lessonActions.nextSibling);

    document.getElementById("completeLessonBtn").onclick = () => {
      if (BloomyStore.isLessonComplete(lessonId)) return;
      BloomyStore.markLessonComplete(lessonId);
      if (typeof showToast === "function") {
        showToast(lang === "id" ? "Pelajaran selesai! +15 XP 🌱" : "Lesson complete! +15 XP 🌱");
      }
      if (typeof syncHomeXP === "function") syncHomeXP();
      injectLessonExtras(); // refresh button state - will skip because id exists, so remove first
      wrap.remove();
      injectLessonExtras();
    };

    document.getElementById("bookmarkLessonBtn").onclick = () => {
      const nowBookmarked = BloomyStore.toggleBookmark(lessonId);
      if (typeof showToast === "function") {
        showToast(nowBookmarked
          ? (lang === "id" ? "Ditambahkan ke bookmark ★" : "Added to bookmarks ★")
          : (lang === "id" ? "Bookmark dihapus" : "Bookmark removed"));
      }
      wrap.remove();
      injectLessonExtras();
    };
  }

  // Also enhance quiz result XP to use the store (prevent double awards)
  // The existing quiz already awards XP via localStorage; our store keeps them in sync via getXP/setXP.

  // Profile name sync on load
  try {
    const p = BloomyStore.getProfile();
    const nameEl = document.getElementById("profileName");
    if (nameEl && p.name) nameEl.textContent = p.name;
    const avatarEl = document.querySelector(".profile-mini .avatar");
    if (avatarEl && p.avatar) avatarEl.textContent = p.avatar;
  } catch (e) {}

  // Minimal extra CSS for new components
  const style = document.createElement("style");
  style.textContent = `
    .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
    .note-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 16px; }
    .note-card strong { font-size: 14px; color: #5c4d61; }
    .note-card p { font-size: 12px; color: var(--muted); margin: 8px 0; line-height: 1.5; }
    .note-meta { display: flex; justify-content: space-between; align-items: center; }
    .note-editor.hidden, .notes-grid.hidden { display: none !important; }
    .empty-state { text-align: center; padding: 48px 20px; color: var(--muted); }
    .secondary-btn { background: #fff; border: 1px solid var(--line); color: var(--ink); padding: 10px 16px; border-radius: 999px; font-weight: 700; cursor: pointer; }
    .secondary-btn:hover { border-color: var(--pink); }
    .avatar-option.selected { transform: scale(1.08); }
    .primary-btn:disabled { opacity: 0.6; cursor: default; }
  `;
  document.head.appendChild(style);

  console.log("BLOOMY Stage 5–6 extension loaded");
})();
