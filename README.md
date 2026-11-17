# BLOOMY — Stage 1 + Stage 2 + Stage 3 + Stage 4

A cute, colorful, bilingual learning platform starter built with HTML, CSS and vanilla JavaScript.

## Stage 1
- Responsive dashboard and navigation
- Indonesian / English language toggle
- Guest-mode welcome modal
- Account entry-point placeholder
- Cute colorful design system and lightweight animations

## Stage 2 — Learning System
- Explore page with 12 learning categories
- Search across categories and lesson titles/descriptions
- Category filter
- Subject detail pages
- Starter lesson cards
- Lesson reading pages with key takeaways
- Bilingual lesson content (Indonesian / English)
- Browser history and hash navigation support
- Starter content stored in `data/learning-content.json`; runtime data is embedded in `js/app.js` so it also works when opening `index.html` directly.

## Run locally
1. Extract the ZIP.
2. Open the `BLOOMY` folder.
3. Double-click `index.html`.

For development, VS Code + Live Server is recommended.

## Stage 3 — Quiz & Flashcards
- Quiz Center with category and difficulty selection
- Multiple-choice questions in Indonesian and English
- Instant answer feedback and short explanations
- Score summary, answer review, retry, and XP rewards
- Flashcard library with flip, previous/next, and shuffle controls
- XP total saved locally in the browser

## Important limitations
- This is a front-end prototype. Account registration, authentication, cloud sync, online accounts, cloud sync, notes, and full learning progress tracking are not implemented yet. Quiz and flashcard features are available locally in Stage 3.
- Guest mode works without registration. The account button is a preview only and does not collect credentials.
- Language preference is saved in browser LocalStorage.
- Google Fonts are loaded online; system fallbacks are provided.
- Learning content is starter material and should be reviewed and expanded before formal educational use.

## Structure
```text
BLOOMY/
├── index.html
├── README.md
├── css/
│   ├── main.css
│   └── responsive.css
├── js/
│   └── app.js
└── data/
    ├── subjects.json
    └── learning-content.json
```

## Next
- Stage 5: Notes, bookmarks, profile and settings
- Later: Optional backend and real accounts


## Stage 4 — Learning Garden & Achievements
- Learning Garden page with a plant that grows through XP milestones
- XP-based learner levels and progress bar
- Six achievement badges that unlock from learning activity
- Daily check-in reward (+5 XP) with a once-per-day limit
- Learning streak counter based on consecutive daily check-ins
- Dashboard stats updated with local XP, learning minutes, and streak
- Garden and achievement interface available in Indonesian and English
- Progress stored locally in the browser on the current device

## Current progression rules
- Quiz rewards: 10 XP for each correct answer
- Daily check-in: 5 XP once per local calendar day
- Plant milestones: 0, 50, 120, 250, and 500 XP
- Levels: each 100 XP advances one level
- Achievements unlock from XP, completed quizzes, best quiz score, and streak

