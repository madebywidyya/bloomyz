/**
 * BLOOMY Bookmarks Module
 */
const BloomyBookmarks = (function () {
  function render() {
    const pageContent = document.getElementById("pageContent");
    if (!pageContent) return;
    const lang = window.currentLanguage || "id";
    const bookmarks = BloomyStore.getBookmarks();

    // Try to resolve lesson titles from global content if available
    let lessonMap = {};
    if (window.learningContent && Array.isArray(window.learningContent)) {
      window.learningContent.forEach(cat => {
        (cat.lessons || []).forEach(l => {
          lessonMap[l.id] = {
            title: lang === "id" ? (l.title_id || l.title) : l.title,
            cat: lang === "id" ? (cat.name_id || cat.name) : cat.name,
            icon: cat.icon || "✿"
          };
        });
      });
    }

    pageContent.innerHTML = `
      <section class="welcome-row">
        <div>
          <div class="eyebrow"><span class="eyebrow-sparkle">★</span><span>${lang === "id" ? "TERSIMPAN" : "SAVED"}</span></div>
          <h1>${lang === "id" ? "Bookmark" : "Bookmarks"}</h1>
          <p class="welcome-subtitle">${lang === "id" ? "Pelajaran favoritmu untuk dibuka lagi nanti." : "Your favorite lessons to reopen later."}</p>
        </div>
      </section>
      <div id="bookmarksList" class="notes-grid"></div>
    `;

    const list = document.getElementById("bookmarksList");
    if (!bookmarks.length) {
      list.innerHTML = `<div class="empty-state"><div style="font-size:48px;margin-bottom:12px">★</div><p>${lang === "id" ? "Belum ada bookmark. Tandai pelajaran dari halaman pelajaran." : "No bookmarks yet. Bookmark lessons from lesson pages."}</p></div>`;
      return;
    }

    list.innerHTML = bookmarks.map(id => {
      const info = lessonMap[id] || { title: id, cat: "", icon: "✿" };
      return `
        <article class="note-card">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="font-size:22px">${info.icon}</span>
            <strong>${escapeHtml(info.title)}</strong>
          </div>
          <p style="color:var(--muted);font-size:12px">${escapeHtml(info.cat)}</p>
          <div class="note-meta" style="margin-top:12px">
            <button class="text-link open-bookmark" data-id="${id}">${lang === "id" ? "Buka" : "Open"} ↗</button>
            <button class="icon-button remove-bookmark" data-id="${id}" title="Remove">🗑</button>
          </div>
        </article>
      `;
    }).join("");

    list.querySelectorAll(".open-bookmark").forEach(btn => {
      btn.onclick = () => {
        if (typeof navigate === "function") {
          // Prefer hash navigation used by existing app
          location.hash = "lesson-" + btn.dataset.id;
          if (typeof renderLesson === "function") renderLesson(btn.dataset.id);
        }
      };
    });
    list.querySelectorAll(".remove-bookmark").forEach(btn => {
      btn.onclick = () => {
        BloomyStore.toggleBookmark(btn.dataset.id);
        if (typeof showToast === "function") showToast(lang === "id" ? "Bookmark dihapus" : "Bookmark removed");
        render();
      };
    });
  }

  function escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  return { render };
})();
