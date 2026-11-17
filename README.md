# BLOOMY — Stage 1: Core Interface

A cute, colorful, bilingual learning platform starter built with HTML, CSS and vanilla JavaScript.

## Included in Stage 1
- Responsive desktop, tablet and mobile dashboard
- Sidebar navigation and mobile menu
- Indonesian / English language toggle
- Guest-mode welcome modal
- Account entry point placeholder
- Learning dashboard, subject cards and visual components
- Lightweight CSS animations and reduced-motion support
- Starter subject catalogue in `data/subjects.json`

## Run locally
1. Extract the ZIP file.
2. Open the `BLOOMY` folder.
3. Double-click `index.html`.

For the best local development experience, open the folder in VS Code and use the Live Server extension.

## Important notes
- This is a front-end Stage 1 prototype. Account registration, authentication, cloud sync, real lesson pages, quizzes and progress persistence are not implemented yet.
- The language preference is saved in browser LocalStorage.
- Google Fonts are loaded online. A system sans-serif fallback is included.
- The account button is intentionally a preview/placeholder; it does not create an account or collect credentials.
- The dashboard numbers are placeholders until learning activity is implemented.

## Project structure
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
    └── subjects.json
```

## Next stages
- Stage 2: Explore, subject pages, lesson viewer, search and filters
- Stage 3: Quiz engine and flashcards
- Stage 4: XP, achievements and Learning Garden
- Stage 5: Notes, bookmarks, profile and settings
- Later: Optional backend and real user accounts
