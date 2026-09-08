# Quantum Quest

A visual, interactive course for learning quantum physics from first principles. All 35 lessons are playable across Foundations, Quantum Language, Atoms and Matter, Entanglement, Applications, and the Mathematical Track. The final six lessons connect complex amplitudes, linear algebra, observables, Hilbert spaces, an exact particle-in-a-box solution, and introductory path-integral and field concepts.

Lesson steps, experiment settings, and results resume on the same browser. Completion requires passing the concept check. Canvas models support pause/play, respect reduced-motion preferences, and suspend animation offscreen. Progress is stored locally, not synchronized between devices; learning remains available when browser storage is blocked.

These are conceptual teaching models, not research simulators. Application lessons label important simplifications, including exaggerated MRI spin imbalance and the difference between a QKD public test sample and a usable secret key. Stage 6 adds 18 interactive experiments, expandable mathematics, and 14 concept-check questions. Complex arithmetic uses Complex.js; finite-state predictions and analytic wavefunctions have independent numerical checks. The eleven-path model is illustrative, and the field model covers one free bosonic mode, not full interacting quantum field theory.

## Mathematical Track

1. Complex numbers: phase, magnitude, and amplitude addition.
2. Linear algebra intuition: basis coordinates, unitary matrices, and gate order.
3. Operators and observables: eigenvalues, expectation values, and measurement order.
4. Hilbert spaces: dimensions, inner products, tensor products, and coherence.
5. Solve Schrodinger's equation: boundary conditions, energy scaling, and time evolution.
6. Path integrals and fields: coherent alternatives, stationary action, and quantized field modes.

The mathematical track is a conceptual bridge to further study, not comprehensive coverage of advanced quantum mechanics or field theory. Reference links within lessons include IBM Quantum Learning, MIT OpenCourseWare, the Feynman Lectures, and CERN.

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

`npm test` checks numerical predictions and normalization, progress, reload recovery, inaccessible storage, keyboard interaction, animation cleanup, reduced motion, and all six new lessons at 320px, 390px, and 1280px widths. `npm run smoke` exercises the complete 35-lesson journey, checks all 35 generated lesson routes, and saves screenshots in `smoke-shots/`.

The site deploys to GitHub Pages from `main` through [the deploy workflow](.github/workflows/deploy.yml), after the regression tests and production build pass.
