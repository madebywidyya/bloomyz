/**
 * BLOOMY Storage Layer
 * Centralized localStorage management to avoid key conflicts and duplicate XP awards.
 */
const BloomyStore = (function () {
  const PREFIX = "bloomy_";
  const KEYS = {
    lang: "lang",
    xp: "xp",
    level: "level",
    streak: "streak",
    checkinDate: "checkin_date",
    completedLessons: "completed_lessons",
    quizHistory: "quiz_history",
    awarded: "awarded_activities", // prevents double XP
    notes: "notes",
    bookmarks: "bookmarks",
    profile: "profile",
    goals: "goals",
    activityLog: "activity_log",
    achievements: "achievements",
    settings: "settings",
    flashProgress: "flash_progress"
  };

  function k(key) { return PREFIX + (KEYS[key] || key); }

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(k(key));
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("BloomyStore get error", key, e);
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(k(key), JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("BloomyStore set error", key, e);
      return false;
    }
  }

  function remove(key) {
    localStorage.removeItem(k(key));
  }

  // ---- Progress helpers ----
  function getXP() {
    // Support legacy key used by existing app.js
    const legacy = Number(localStorage.getItem("bloomy-xp") || 0);
    const modern = get("xp", null);
    if (modern === null) return legacy;
    return Math.max(legacy, Number(modern) || 0);
  }

  function setXP(n) {
    const val = Math.max(0, Number(n) || 0);
    set("xp", val);
    localStorage.setItem("bloomy-xp", String(val)); // keep legacy in sync
  }

  function addXP(amount, activityId) {
    amount = Number(amount) || 0;
    if (amount <= 0) return getXP();
    const awarded = get("awarded", {});
    if (activityId && awarded[activityId]) {
      return getXP(); // already awarded
    }
    const next = getXP() + amount;
    setXP(next);
    if (activityId) {
      awarded[activityId] = Date.now();
      set("awarded", awarded);
    }
    // Level = floor(xp / 100) + 1
    const level = Math.floor(next / 100) + 1;
    set("level", level);
    logActivity("xp", { amount, activityId, total: next });
    return next;
  }

  function getLevel() {
    return get("level", Math.floor(getXP() / 100) + 1);
  }

  function getStreak() {
    const legacy = Number(localStorage.getItem("bloomy-streak") || 0);
    return Math.max(legacy, get("streak", 0));
  }

  function setStreak(n) {
    set("streak", n);
    localStorage.setItem("bloomy-streak", String(n));
  }

  function getCompletedLessons() {
    return get("completedLessons", []);
  }

  function markLessonComplete(lessonId) {
    const list = getCompletedLessons();
    if (!list.includes(lessonId)) {
      list.push(lessonId);
      set("completedLessons", list);
      addXP(15, "lesson_" + lessonId);
      logActivity("lesson", { lessonId });
    }
    return list;
  }

  function isLessonComplete(lessonId) {
    return getCompletedLessons().includes(lessonId);
  }

  function getQuizHistory() {
    return get("quizHistory", []);
  }

  function saveQuizResult(result) {
    const hist = getQuizHistory();
    hist.unshift({
      ...result,
      date: new Date().toISOString()
    });
    if (hist.length > 50) hist.length = 50;
    set("quizHistory", hist);
    logActivity("quiz", result);
  }

  function getNotes() {
    return get("notes", []);
  }

  function saveNotes(notes) {
    set("notes", notes);
  }

  function getBookmarks() {
    return get("bookmarks", []);
  }

  function toggleBookmark(lessonId) {
    let list = getBookmarks();
    const idx = list.indexOf(lessonId);
    if (idx >= 0) {
      list.splice(idx, 1);
      set("bookmarks", list);
      return false;
    }
    list.push(lessonId);
    set("bookmarks", list);
    return true;
  }

  function isBookmarked(lessonId) {
    return getBookmarks().includes(lessonId);
  }

  function getProfile() {
    return get("profile", {
      name: "Guest learner",
      avatar: "🌸",
      joined: new Date().toISOString().slice(0, 10)
    });
  }

  function saveProfile(p) {
    set("profile", p);
  }

  function getGoals() {
    return get("goals", []);
  }

  function saveGoals(goals) {
    set("goals", goals);
  }

  function logActivity(type, data) {
    const log = get("activityLog", []);
    log.unshift({
      type,
      data,
      ts: new Date().toISOString()
    });
    if (log.length > 200) log.length = 200;
    set("activityLog", log);
  }

  function getActivityLog() {
    return get("activityLog", []);
  }

  function getAchievements() {
    return get("achievements", {});
  }

  function unlockAchievement(id) {
    const a = getAchievements();
    if (!a[id]) {
      a[id] = Date.now();
      set("achievements", a);
      logActivity("achievement", { id });
      return true;
    }
    return false;
  }

  function getSettings() {
    return get("settings", { theme: "pastel", language: "id" });
  }

  function saveSettings(s) {
    set("settings", s);
  }

  function resetAll() {
    Object.keys(KEYS).forEach((key) => remove(key));
    // also clear legacy
    ["bloomy-xp", "bloomy-streak", "bloomy-checkin-date"].forEach((k) =>
      localStorage.removeItem(k)
    );
  }

  // Public API
  return {
    get, set, remove, k,
    getXP, setXP, addXP, getLevel,
    getStreak, setStreak,
    getCompletedLessons, markLessonComplete, isLessonComplete,
    getQuizHistory, saveQuizResult,
    getNotes, saveNotes,
    getBookmarks, toggleBookmark, isBookmarked,
    getProfile, saveProfile,
    getGoals, saveGoals,
    logActivity, getActivityLog,
    getAchievements, unlockAchievement,
    getSettings, saveSettings,
    resetAll
  };
})();
