/**
 * BLOOMY Notes Module
 */
const BloomyNotes = (function () {
  function t(key) {
    if (typeof window.t === "function") return window.t(key);
    return key;
  }

  function render() {
    const pageContent = document.getElementById("pageContent");
    if (!pageContent) return;
    const notes = BloomyStore.getNotes();
    const lang = (window.currentLanguage || "id");

    pageContent.innerHTML = `
      <section class="welcome-row">
        <div>
          <div class="eyebrow"><span class="eyebrow-sparkle">✦</span><span>${t("myNotes") || (lang === "id" ? "CATATANKU" : "MY NOTES")}</span></div>
          <h1>${t("notes") || (lang === "id" ? "Catatan" : "Notes")}</h1>
          <p class="welcome-subtitle">${lang === "id" ? "Simpan ide dan ringkasan pelajaranmu di sini." : "Save ideas and lesson summaries here."}</p>
        </div>
        <button class="primary-btn" id="addNoteBtn">＋ ${t("addNote") || (lang === "id" ? "Tambah catatan" : "Add note")}</button>
      </section>
      <div class="search-bar-wrap" style="margin-bottom:16px">
        <input type="search" id="noteSearch" placeholder="${t("searchNotes") || (lang === "id" ? "Cari catatan..." : "Search notes...")}" class="search-input">
      </div>
      <div id="notesList" class="notes-grid"></div>
      <div id="noteEditor" class="note-editor hidden"></div>
    `;

    renderList(notes);
    document.getElementById("addNoteBtn").onclick = () => openEditor();
    document.getElementById("noteSearch").oninput = (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = notes.filter(n =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.body || "").toLowerCase().includes(q)
      );
      renderList(filtered);
    };
  }

  function renderList(notes) {
    const list = document.getElementById("notesList");
    if (!list) return;
    const lang = window.currentLanguage || "id";
    if (!notes.length) {
      list.innerHTML = `<div class="empty-state"><div style="font-size:48px;margin-bottom:12px">📝</div><p>${t("noNotes") || (lang === "id" ? "Belum ada catatan. Buat catatan pertamamu!" : "No notes yet. Create your first note!")}</p></div>`;
      return;
    }
    list.innerHTML = notes.map(n => `
      <article class="note-card" data-id="${n.id}">
        <strong>${escapeHtml(n.title || (lang === "id" ? "Tanpa judul" : "Untitled"))}</strong>
        <p>${escapeHtml((n.body || "").slice(0, 120))}${(n.body || "").length > 120 ? "…" : ""}</p>
        <div class="note-meta">
          <small>${new Date(n.updated || n.created).toLocaleDateString()}</small>
          <div>
            <button class="icon-button edit-note" data-id="${n.id}" title="Edit">✎</button>
            <button class="icon-button delete-note" data-id="${n.id}" title="Delete">🗑</button>
          </div>
        </div>
      </article>
    `).join("");

    list.querySelectorAll(".edit-note").forEach(btn => {
      btn.onclick = () => {
        const note = BloomyStore.getNotes().find(x => x.id === btn.dataset.id);
        if (note) openEditor(note);
      };
    });
    list.querySelectorAll(".delete-note").forEach(btn => {
      btn.onclick = () => {
        if (!confirm(lang === "id" ? "Hapus catatan ini?" : "Delete this note?")) return;
        const notes = BloomyStore.getNotes().filter(x => x.id !== btn.dataset.id);
        BloomyStore.saveNotes(notes);
        if (typeof showToast === "function") showToast(lang === "id" ? "Catatan dihapus" : "Note deleted");
        render();
      };
    });
  }

  function openEditor(note) {
    const editor = document.getElementById("noteEditor");
    const list = document.getElementById("notesList");
    if (!editor) return;
    const lang = window.currentLanguage || "id";
    const isNew = !note;
    note = note || { id: "n_" + Date.now(), title: "", body: "", created: new Date().toISOString() };

    if (list) list.classList.add("hidden");
    editor.classList.remove("hidden");
    editor.innerHTML = `
      <div class="card" style="padding:20px">
        <h2>${isNew ? (lang === "id" ? "Catatan baru" : "New note") : (lang === "id" ? "Edit catatan" : "Edit note")}</h2>
        <input type="text" id="noteTitleInput" class="search-input" style="width:100%;margin:12px 0" placeholder="${t("noteTitle") || "Title"}" value="${escapeHtml(note.title || "")}">
        <textarea id="noteBodyInput" class="search-input" style="width:100%;min-height:160px;margin-bottom:12px" placeholder="${t("noteBody") || "Write something..."}">${escapeHtml(note.body || "")}</textarea>
        <div style="display:flex;gap:10px">
          <button class="primary-btn" id="saveNoteBtn">${t("saveNote") || (lang === "id" ? "Simpan" : "Save")}</button>
          <button class="secondary-btn" id="cancelNoteBtn">${t("cancel") || (lang === "id" ? "Batal" : "Cancel")}</button>
        </div>
      </div>
    `;

    document.getElementById("saveNoteBtn").onclick = () => {
      note.title = document.getElementById("noteTitleInput").value.trim() || (lang === "id" ? "Tanpa judul" : "Untitled");
      note.body = document.getElementById("noteBodyInput").value.trim();
      note.updated = new Date().toISOString();
      let notes = BloomyStore.getNotes();
      const idx = notes.findIndex(x => x.id === note.id);
      if (idx >= 0) notes[idx] = note;
      else notes.unshift(note);
      BloomyStore.saveNotes(notes);
      if (typeof showToast === "function") showToast(lang === "id" ? "Catatan disimpan ✓" : "Note saved ✓");
      render();
    };
    document.getElementById("cancelNoteBtn").onclick = () => render();
  }

  function escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  return { render };
})();
