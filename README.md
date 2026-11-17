# BLOOMY — Complete Interactive Educational Platform (Stages 1–6)

A cute, colorful, bilingual (Bahasa Indonesia / English) learning platform built with pure HTML, CSS and vanilla JavaScript.  
No backend required. Open `index.html` directly in a browser.

## Features

### Stage 1 — Foundation & Dashboard
- Responsive dashboard with sidebar + top navigation
- Guest mode welcome modal
- Language switcher (ID / EN) with local persistence
- Quick stats, welcome section, category previews

### Stage 2 — Learning Library
- 12 learning categories (Mathematics, Science, Languages, Technology, History & Culture, Arts, Geography, Life Skills, Psychology, Islamic Studies, Literature, Nature & Environment)
- Search and category browsing
- Lesson detail pages with bilingual content and key takeaways
- Mark lesson complete (+15 XP)

### Stage 3 — Quiz & Flashcards
- Multiple-choice and true/false quizzes with difficulty levels
- Instant feedback, explanations, score summary, retry
- Flashcard decks with flip animation, prev/next, shuffle
- XP rewards for correct answers

### Stage 4 — Gamification
- XP and level system (100 XP = 1 level)
- Daily check-in (+5 XP, once per day)
- Learning streak
- Learning Garden with plant growth milestones
- Achievement badges unlocked by activity

### Stage 5 — Personal Learning Tools
- **My Notes** — create, edit, delete, search notes
- **Bookmarks** — save / remove favorite lessons
- **Profile** — display name, avatar picker, quick stats
- **Settings** — language preference, local data reset with confirmation

### Stage 6 — Learning Analytics & Progress
- Overall stats: lessons completed, quizzes, average score, XP, level, streak
- Level progress bar
- Learning goals (create, track progress, delete)
- Weekly activity summary
- Activity history timeline

## How to run

1. Extract the ZIP.
2. Open the `BLOOMY` folder.
3. Double-click `index.html` (or open it with any modern browser).

Recommended for development: VS Code + Live Server extension.

## Data storage

All progress (XP, completed lessons, quiz history, notes, bookmarks, goals, achievements, language preference) is stored in the browser’s **localStorage** on the current device.

- No cloud sync
- No real authentication
- Guest progress is local only
- Use the Profile page → “Reset all progress” to clear everything

## Project structure

```text
BLOOMY/
├── index.html
├── README.md
├── css/
│   ├── main.css
│   └── responsive.css
├── js/
│   ├── app.js              # Core (Stages 1–4)
│   ├── storage.js          # Centralized localStorage
│   ├── notes.js
│   ├── bookmarks.js
│   ├── profile.js
│   ├── analytics.js
│   └── app-extension.js    # Stage 5–6 integration
├── data/
│   ├── learning-content.json
│   ├── subjects.json
│   ├── quizzes.json
│   └── flashcards.json
└── assets/
    ├── images/
    └── icons/
```

## Technical notes

- Pure front-end: HTML5 + CSS3 + Vanilla JS
- Mobile-first responsive design
- Works offline after first load (Google Fonts need network)
- No paid APIs or external services required
- Designed to avoid duplicate XP awards for the same activity

## Testing checklist

- [ ] Language toggle switches all visible text
- [ ] Sidebar navigation reaches every page
- [ ] Explore → category → lesson flow works
- [ ] Mark lesson complete awards XP once
- [ ] Quiz can be taken, scored, reviewed and retried
- [ ] Flashcards flip, navigate and shuffle
- [ ] Daily check-in works once per day and updates streak
- [ ] Notes CRUD + search
- [ ] Bookmarks add/remove and open
- [ ] Profile name & avatar save
- [ ] Goals create / increment / delete
- [ ] Analytics numbers update after activities
- [ ] Reset progress clears data
- [ ] Mobile menu and layout remain usable

## Credits

Built as an educational front-end prototype.  
Content is starter material and should be reviewed before formal educational use.

✿ Grow your mind, one little step at a time.
