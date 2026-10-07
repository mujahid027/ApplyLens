# ApplyLens

ApplyLens is a calm, privacy-first job application tracker. It helps job seekers track roles, application stages, follow-ups, and search progress without creating an account or sending personal data to a server.

## Why this project?

Most job trackers either turn a personal search into another subscription or make the interface feel like a spreadsheet. ApplyLens explores a smaller alternative: a fast, local-first dashboard with a deliberate visual system and the essentials needed for daily use.

## Features

- Add, edit, and delete job applications
- Filter by pipeline stage and search across company, role, location, and notes
- Live counts for total applications, active roles, interviews, and offers
- Responsive, keyboard-friendly dialog workflow
- Local browser persistence via `localStorage`; no account, analytics, or server
- Automated unit tests and GitHub Actions validation

## Run locally

No build step is needed. Open `index.html` in a browser, or serve the directory with any static-file server.

```bash
npm run check
npm test
```

## Architecture

The app intentionally uses framework-free ES modules to keep the code small and readable:

```text
index.html        UI structure
src/app.mjs       DOM rendering, events, browser storage
src/core.mjs      Pure domain logic and metrics
src/styles.css    Responsive visual system
test/             Node's built-in test runner
```

Keeping `core.mjs` separate means search, validation, and metrics can be tested without a browser and later reused by an API or a framework UI.

## Roadmap

- [ ] Import/export a JSON backup
- [ ] Follow-up reminders
- [ ] Accessibility audit and keyboard-navigation tests
- [ ] Optional hosted sync using an authenticated backend

## License

MIT
