# BLOOMY — Stage 1 + Stage 2

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

## Important limitations
- This is a front-end prototype. Account registration, authentication, cloud sync, quiz engine, flashcards, notes, and learning progress tracking are not implemented yet.
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
- Stage 3: Quiz engine and flashcards
- Stage 4: XP, achievements and Learning Garden
- Stage 5: Notes, bookmarks, profile and settings
- Later: Optional backend and real accounts
