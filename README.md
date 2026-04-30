# My Expense Tracker (formerly Fenmo)

A minimal full-stack Expense Tracker built with Next.js App Router and Tailwind CSS, focused on delivering a beautiful, seamless, and deeply functional user experience.

## The Idea Behind the Project & The User Perspective
When designing this project, the primary goal was to step into the shoes of an everyday user who wants to manage their finances without feeling overwhelmed. Financial apps can often feel cold, confusing, or overly analytical. My philosophy was: **"Finance should be beautiful, intuitive, and instantly rewarding."**

I thought about what I would find necessary as a user:
1. **Instant Clarity**: I don't want to dig through menus to see how much I've spent. That led to building a highly dynamic Dashboard where the graph dynamically shrinks or expands based on my very first entry, avoiding empty data days.
2. **Actionable Budgeting**: Instead of just tracking spending, I wanted visual guardrails. The monthly budget bar that turns red when over budget is designed to provide an immediate psychological cue.
3. **Frictionless Savings (Goals)**: Users don't just spend; they save. The Goals tab was built with an inline quick-add/deduct system so users can instantly log a $10 deposit into their "New Car" fund without navigating away or filling out complex forms.
4. **Seamless Adjustments**: The ability to edit transactions directly and filter by custom date ranges or categories makes the app feel like a real tool rather than a static spreadsheet.
5. **Aesthetics & Accessibility**: Adding a premium design, global search, and a flawless Dark Mode ensures the app feels like a modern SaaS product that users *want* to open every day.

## Recent Updates & Feature Additions
- **Local Storage Migration**: The backend architecture was completely refactored from relying on physical JSON files and server-side API routes to a lightweight, offline-ready `localStorage` database (`lib/localDb.ts`). This makes the app instantly portable and eliminates server dependency issues.
- **Dynamic Spending Trends**: The dashboard chart now dynamically calculates its active duration based on the first recorded expense, intelligently scaling the X-axis up to a maximum of 30 days.
- **Savings Goals Module**: A dedicated `/goals` section allowing users to create specific savings targets, visually track progress, and instantly add/deduct funds directly from the goal card.
- **Global Search**: Added a highly responsive search bar in the global navigation that instantly queries and filters expenses based on descriptions or categories.
- **Dark Mode Engine**: Engineered a smart CSS-filter-based dark mode that perfectly preserves semantic colors (reds and greens) while providing a stunning dark aesthetic with a single click.

## Key Design Decisions
- **Premium UI Aesthetic**: Implemented a modern, premium design utilizing soft gradients, shadows, and crisp typography to create a polished user experience.
- **Next.js App Router**: Chosen for its robust capabilities, even when operating purely as a powerful client-side interface.
- **Client-Side Filtering & Sorting**: To ensure a snappy user experience, all filtering, search queries, and sorting are handled dynamically on the client side using React hooks (`useMemo`).

## Trade-offs Made
- **Authentication**: Left out to focus purely on the core expense tracking and frontend logic.
- **Advanced Backend**: By switching to `localStorage`, the app is incredibly fast for a single user on a single device, but it lacks the cross-device sync capabilities of a traditional hosted database (like PostgreSQL or Firebase).
- **Pagination**: The entire dataset is loaded into memory at once. For thousands of expenses, this is acceptable for `localStorage`, but would require pagination if moved back to a remote server.
