## UnimeSpace – Student Social & Test Platform

UnimeSpace is a web platform for university students that combines a social feed with tools for creating and solving practice tests. Students can join topic‑based communities, share posts and study materials, and take or author tests containing multiple‑choice and coding questions.

This repository contains the frontend for `unime.space`, built with React, Vite, Redux Toolkit, and Tailwind CSS.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Social Feed & Posts](#social-feed--posts)
  - [Communities (Boards & Descs)](#communities-boards--descs)
  - [Tests & Results](#tests--results)
  - [Test Creation & Drafts](#test-creation--drafts)
  - [Profiles & Search](#profiles--search)
  - [Help, Contact & Terms](#help-contact--terms)
  - [Admin & Moderation](#admin--moderation)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Build & Preview](#build--preview)
- [Environment Configuration](#environment-configuration)
- [Project Structure (High Level)](#project-structure-high-level)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

UnimeSpace is designed to support university students in two main ways:

- As a **social platform**, where they can discuss courses, exams, and campus life, and share notes, files, and updates in organized communities.
- As a **practice platform**, where they can create and take tests composed of multiple‑choice and coding questions to prepare for exams.

The frontend in this repository handles the full user experience: routing, state management, UI, and communication with the backend API.

---

## Key Features

### Social Feed & Posts

- Home feed showing posts and tests from communities the user follows.
- Rich post creation with formatted text, images, and file attachments.
- Post detail pages with likes, comments, replies, sharing, and reporting.
- Relative time display (e.g. “a few minutes ago”) for recent activity.

### Communities (Boards & Descs)

- **Boards** – post‑focused communities (discussions, resources, notes).
- **Descs** – test‑focused communities (practice tests for specific subjects).
- Community pages with headers, subscriptions, member lists, and sorted content.
- Recent and recommended communities surfaced in sidebars.

### Tests & Results

- Test detail pages with title, author, desc, description, duration, and question count.
- Two test‑taking modes:
  - **One‑by‑one** – single question at a time with navigation.
  - **All‑in‑one** – all questions on a single page.
- Support for:
  - Multiple‑choice questions (single or multi‑select).
  - Coding questions with code‑like answers validated against test cases.
- Review step before submission, including warnings for unanswered questions.
- Automatic submission when the timer ends.
- Results page with:
  - Overall score (percentage, color‑coded).
  - Correct / total points.
  - Per‑question breakdown (including code check results for coding items).

### Test Creation & Drafts

- Create tests within a desc with title, description, and duration.
- Add MCQ and coding questions, including:
  - MCQ options with selected correct answers.
  - Coding function signatures, arguments, and expected outputs.
- Edit and remove questions before publishing.
- Draft support:
  - Tests start as drafts.
  - Drafts list page with metadata (title, description, created time).
  - Continue editing or delete drafts.
- Publish tests so they appear under the corresponding desc for others to take.

### Profiles & Search

- User profiles with avatar, banner, name, username, join date, and extra details.
- Tabs for:
  - Overview
  - Posts authored
  - Tests authored
  - Comments made
- Profile editing (name, username, bio, avatar, banner, and other fields).
- Separate views for own profile vs other users’ profiles, with user reporting options.
- Search page with a shared query and tabbed results across:
  - Posts
  - Tests
  - Boards
  - Descs
- Explore views for browsing all boards and all descs with filters (subscribed, owned, all).

### Help, Contact & Terms

- FAQ page with:
  - Search.
  - Categories.
  - Step‑by‑step tutorials (e.g. how to create communities, posts, tests).
- About page describing the story and goals of UnimeSpace.
- Contact page with form (name, email, subject, message) and success/error feedback.
- Terms & Conditions page loaded from the backend and styled for light/dark mode.

### Admin & Moderation

- Separate admin area with:
  - Basic admin dashboard.
  - Admin test‑creation tools.
  - JSON‑based content generation tooling (for internal/admin use).
- Reports management:
  - View reported posts, comments, and users.
  - Filter reports by status, target type, date, and more.
  - Update report status (e.g. open, in review, resolved, warned, banned).

---

## Tech Stack

- **Framework**: React + Vite
- **Routing**: React Router
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Data Fetching**: RTK Query–style API slices (in `src/services`)
- **Styling**: Tailwind CSS (via `@tailwindcss/vite` and `tailwindcss`)
- **Markdown Rendering**: `react-markdown` + `remark-gfm`
- **Icons**: `lucide-react`
- **Tooling**:
  - Vite dev server and build tool
  - ESLint (`@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)

---

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (or another compatible package manager)
- Access to the backend API that UnimeSpace expects (the base URL is configured via environment variables).

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org-or-user/meromah.git
cd meromah
npm install
```

### Development

Start the development server (default Vite port is `5173`):

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser (or the host/port shown in the terminal).

### Build & Preview

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

---

## Environment Configuration

The frontend expects some environment variables, most importantly the API base URL, for example:

- `VITE_API_BASE_URL` – base URL of the backend API used for all data fetching (auth, posts, tests, communities, etc.).

Create a `.env.local` (or similar Vite‑compatible env file) and define the required variables:

```bash
VITE_API_BASE_URL=https://api.unime.space
```

> Note: The exact values depend on your backend deployment. Do not commit secrets to version control.

---

## Project Structure (High Level)

This is a simplified view of the main folders:

- `src/`
  - `App.jsx` – main application routes.
  - `main.jsx` – entry point that mounts the React app and Redux store.
  - `app/` – Redux store and slices (e.g. auth, profile, test session, home feed).
  - `pages/`
    - `main/` – public pages like login, register, FAQ, about, contact.
    - `user/` – authenticated user area (feeds, posts, boards, descs, tests, profile).
    - `system/` – admin/system pages (reports, admin test creation, etc.).
  - `components/` – shared UI components (sidebar, modals, markdown viewers, toasts, etc.).
  - `services/` – API slices for posts, comments, tests, users, reports, and other resources.
  - `hooks/` – custom hooks for sorting, fetching, and page behavior.
  - `utils/` – helper functions and constants.
  - `index.css` – global styles (integrated with Tailwind).

---

## Contributing

At the moment, UnimeSpace is developed and maintained by a small team. If you are interested in contributing, you can:

- Open an issue describing a bug, idea, or improvement.
- Propose changes via pull requests that:
  - Keep the codebase consistent with existing patterns.
  - Include clear descriptions and, when possible, screenshots or steps to reproduce.

Please discuss larger changes before starting work to keep the roadmap aligned.

---

## License

License information for this frontend has not been explicitly defined in this repository. If you plan to reuse or modify the code, please contact the maintainers of UnimeSpace or the repository owner to clarify usage terms.

