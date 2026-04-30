# Fenmo Expense Tracker

A minimal full-stack Expense Tracker built with Next.js App Router and Tailwind CSS.

## Key Design Decisions
- **Premium UI Aesthetic**: Implemented a modern, premium design inspired by the provided template, utilizing soft gradients, shadows, and crisp typography to create a polished user experience.
- **Next.js App Router**: Chosen for its seamless full-stack capabilities, allowing us to build both the frontend and the backend API within the same repository efficiently.
- **Persistence Mechanism**: I used a simple JSON file (`expenses.json`) for persistence instead of an in-memory store. This provides a balance between simplicity for this small assignment and the ability to persist data across hot-reloads and server restarts. In a real production app, this would be replaced by a database like PostgreSQL or MongoDB.
- **Client-Side Filtering & Sorting**: To ensure a snappy user experience and reduce server load, filtering and sorting are handled on the client side using `useMemo` based on the fetched dataset.
- **Idempotency Strategy**: The backend handles basic validation, but the frontend manages the primary idempotency by disabling the submit button and showing a loading state during the network request, preventing accidental double submissions.

## Trade-offs Made Because of Timebox
- **Authentication**: Left out to focus purely on the core expense tracking logic.
- **Advanced Idempotency**: True idempotency would require generating a unique key on the frontend and validating it against stored keys on the backend (e.g., using Redis). We omitted this for a simpler boolean lock on the UI.
- **Database**: Using JSON file storage is adequate for a single-user prototype but lacks concurrency controls and scalability for a real multi-user environment.
- **Pagination**: The entire dataset is fetched at once. For thousands of expenses, server-side pagination should be implemented.

## What Was Intentionally Not Done
- **Complex State Management**: Skipped Redux/Zustand since the state is straightforward and manageable with standard React Hooks (`useState`, `useEffect`).
- **Comprehensive Test Suite**: Due to the timebox, fully automated E2E tests (Cypress/Playwright) were not implemented, though the app is architected cleanly enough to add them easily.
