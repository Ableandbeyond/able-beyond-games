# Animal Matching & Identification

An interactive, accessible, vanilla web application designed for Special Educational Needs (SEN) classrooms, early years, and PMLD learners. 

## Educational Objectives
- **Animal Recognition**: Learn to identify animals visually.
- **Vocabulary & Reading**: Associate written words with corresponding animals.
- **Communication**: Hear animal names spoken aloud via Text-to-Speech to support speech and language intervention.
- **Cause and Effect**: Provide immediate, calm, and positive feedback for every interaction.

## Features & Controls
- **Calm Learning**: No timers, scores, buzzing, shaking, or failure states. Incorrect matches simply clear smoothly.
- **Accessibility**: Meets WCAG 2.2 AA standards. Includes full keyboard navigation, switch-scanning compatibility, screen reader support via ARIA tags, High Contrast mode, and Reduced Motion support.
- **Persistent Toolbar**: Allows users to toggle Mute, Text-to-Speech, Master Volume, Dark Theme, High Contrast, and Fullscreen. Settings are saved to `localStorage`.
- **Offline Capable**: Written in vanilla HTML, CSS, and JS. Can be run locally by opening `index.html`.

## Installation & Usage
1. Clone the repository.
2. Open `index.html` in any modern web browser.
3. No build tools or Node.js dependencies are required.

## GitHub Pages Deployment
This repository is configured to automatically deploy to GitHub Pages on every push to the `main` branch via a GitHub Actions workflow (`deploy.yml`).

## Folder Structure
```
/
├── index.html        # Main entry point
├── styles.css        # Vanilla CSS, fully responsive
├── app.js            # Main application logic
├── data.js           # Animal database (JSON structure)
├── audio.js          # Audio context and playback handling
├── speech.js         # Speech synthesis (Text-to-Speech)
├── ui.js             # DOM manipulation and event binding
├── assets/           # Images, sounds, and icons
├── tasks.md          # Project roadmap and checklist
└── .github/          # GitHub Actions workflows
```

## Future Improvements
- Expand the animal database.
- Add support for custom image uploads for personalized learning.
- Introduce advanced reporting features for educators (if required, keeping in mind the "no score" philosophy).
