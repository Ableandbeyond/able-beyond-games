# Project Roadmap & Tasks

## Architecture
- **Vanilla SPA**: Single Page Application using vanilla ES2023.
- **State Management**: Centralized state object in `app.js` holding current page, selected items, and preferences.
- **Modular Design**: Separation of concerns via ES6 modules (`ui.js`, `audio.js`, `speech.js`, `data.js`).

## Development Phases
1. **Foundation**: Setup directory structure, files, and basic HTML layout.
2. **Styling (CSS)**: Implement CSS variables, layout grid, themes (Dark, Light, High Contrast), and responsive design.
3. **Core Logic**: Load data, render cards, handle pagination (3-4 pairs per page).
4. **Interaction**: Implement the matching logic (image <-> word), animations, and positive feedback.
5. **Accessibility & Media**: Integrate Web Speech API, Audio API, keyboard navigation, and ARIA labels.
6. **Polish**: Save preferences to `localStorage`, optimize performance, verify validation checklist.

## Feature Checklist
- [ ] 30 animals across 6 categories
- [ ] 3-4 pairs per page
- [ ] Next/Previous pagination
- [ ] Soft animations and positive feedback
- [ ] Persistent settings toolbar
- [ ] LocalStorage preferences saving
- [ ] Text-to-Speech for names
- [ ] Animal sounds / UI chimes
- [ ] Fully responsive layout

## Deployment Checklist
- [ ] `deploy.yml` created and using v4 actions.
- [ ] No local build tools required.
- [ ] Ready for GitHub Pages.

## Validation Checklist
- [ ] No JavaScript syntax errors
- [ ] No console errors
- [ ] All navigation works
- [ ] Matching logic works
- [ ] Speech synthesis works
- [ ] Animal sounds play
- [ ] Accessibility labels exist
- [ ] Keyboard navigation functions
- [ ] Mobile responsive
- [ ] GitHub Pages compatible
- [ ] localStorage saves settings
- [ ] reduced motion works
