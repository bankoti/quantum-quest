# Quantum Quest

A visual, interactive course for learning quantum physics from first principles. The course includes a 35-lesson roadmap and 29 complete lessons across Foundations, Quantum Language, Atoms and Matter, Entanglement, and Applications. It moves from scale, quantized energy, and photons through wavefunctions, atoms, joint states, Bell experiments, decoherence, lasers, semiconductors, MRI, qubits, circuits, and quantum key distribution.

Lesson steps, experiment settings, and results resume on the same browser. Completion requires passing the concept check. Canvas models support pause/play, respect reduced-motion preferences, and suspend animation offscreen. Progress is stored locally, not synchronized between devices; learning remains available when browser storage is blocked.

These are conceptual teaching models, not research simulators. Application lessons include notes on important simplifications, including exaggerated MRI spin imbalance and the difference between a QKD public test sample and a usable secret key. The six Stage 6 lessons remain planned.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npx playwright install chromium
npm test
npm run build
npm run smoke
```

`npm test` checks progress, reload recovery, inaccessible storage, keyboard interaction, animation cleanup, reduced motion, and mobile/desktop layouts. `npm run smoke` exercises the complete 29-lesson journey and saves screenshots in `smoke-shots/`.

The site deploys to GitHub Pages from `main` through [the deploy workflow](.github/workflows/deploy.yml), after the regression tests and production build pass.
