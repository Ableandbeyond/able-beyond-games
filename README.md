# Sensory Room

A calming sensory web application designed for children with Special Educational Needs (SEN), Autism (ASD), PMLD, and learning disabilities.

## Features
- **Bubble Tube Room**: Gentle, colourful bubble tubes with soothing sounds.
- **Cosmic Disco**: Calming nebula blobs with interactive stardust.
- **Interactive Soundboard**: Large glowing shapes playing pentatonic notes.
- **Zero Dependencies**: Pure HTML, CSS, and JS.
- **Procedural Audio**: Soft sounds generated in real-time via the Web Audio API.

## Accessibility
Compliant with WCAG 2.2 AA:
- Fully keyboard & switch accessible.
- Screen reader support via ARIA attributes.
- High contrast and reduced motion options.
- No flashing or sudden sounds.
- Large touch targets for interactive whiteboards and tablets.

## Deployment
This project is configured to automatically deploy to GitHub Pages via GitHub Actions.
- Ensure the repository is pushed to `main`.
- The GitHub action will build and deploy the static site.

## Folder Structure
```
/
├── index.html
├── styles.css
├── app.js
├── audio.js
├── particles.js
├── bubbletube.js
├── disco.js
├── soundboard.js
├── assets/
│   ├── sounds/
│   ├── icons/
│   └── images/
├── README.md
├── tasks.md
└── .github/
    └── workflows/
        └── deploy.yml
```

## Future Improvements
- Add PWA manifest and Service Worker for true offline installation.
- Implement more sensory rooms (e.g., fiber optics, rain window).
- Localize interface strings.
