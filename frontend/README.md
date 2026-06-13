# SMG Employee Management Portal - Frontend Application

This directory contains the client-side User Interface for the SMG Employee Management Portal. It is a high-performance Single Page Application (SPA) built using React.js and compiled with Vite.

---

### 1. Architectural Overview

The frontend strictly adheres to a component-based architecture, utilizing React Context for global state management and functional hooks for encapsulated logic. It acts as the presentation layer, consuming the RESTful APIs provided by the backend service.

#### Core Technologies
| Technology | Role | Justification |
| :--- | :--- | :--- |
| **React (v18)** | UI Framework | Component modularity and efficient DOM rendering. |
| **Vite** | Build Tool | Extremely fast Hot Module Replacement (HMR) and optimized build sizes. |
| **Tailwind CSS** | Styling | Utility-first CSS for rapid, scalable, and responsive design. |
| **Lucide React** | Iconography | Lightweight SVG icons used comprehensively across the UI. |
| **React Router** | Navigation | Client-side routing for seamless page transitions without reloads. |

---

### 2. Directory Structure

```text
frontend/
├── public/                 # Static assets (images, favicons)
├── src/                    # Primary Source Code
│   ├── components/         # Reusable UI primitives (Buttons, Modals, Forms)
│   ├── context/            # React Context Providers (AuthContext, AppContext)
│   ├── pages/              # View Controllers (Top-level routed components)
│   │   ├── admin/          # Administrator-specific views
│   │   ├── employee/       # Employee self-service views
│   │   └── superadmin/     # System-wide oversight views
│   ├── services/           # Abstractions for API requests (`fetch` wrappers)
│   ├── styles/             # Global CSS definitions and Tailwind base styles
│   ├── utils/              # Helper utilities (PDF exporters, formatters)
│   ├── App.tsx             # Root Application wrapper and layout definition
│   └── main.tsx            # React DOM Entry Point
├── package.json            # Dependency manifest
├── tailwind.config.js      # Tailwind CSS configuration and theme extensions
└── vite.config.ts          # Vite compiler configuration
```

---

### 3. Application State & Authentication

State management relies heavily on `React.useContext` integrated with `localStorage` for session persistence.
1. **Authentication State**: Managed via `AuthContext`. On successful login, the JWT and User ID are saved in `localStorage`.
2. **Protected Routes**: The `App.tsx` router dynamically restricts navigation paths based on the `userRole` (`employee`, `admin`, `superadmin`, `department`). If a valid JWT is missing, the application redirects the user to the Login screen.

---

### 4. API Integration Strategy

All data fetching operations utilize `useEffect` hooks triggering native `fetch()` calls. 
Data synchronization relies on:
- **Mount Fetching**: Component loads and instantly fetches necessary data (`GET`).
- **Optimistic UI Updates**: Upon standard actions like Leave requests or Gate Passes (`POST`), the UI arrays are immediately mutated using the response document, precluding the need for a full page refresh.

---

### 5. Setup and Development Instructions

**1. Dependency Installation**
Navigate to this directory and install all node modules:
```bash
cd frontend
npm install
```

**2. Local Development Execution**
Launch the Vite development server (usually binds to `http://localhost:5173`):
```bash
npm run dev
```

**3. Production Compilation**
To build the application for deployment to a static host (Vercel, Netlify, AWS S3):
```bash
npm run build
```
This generates a highly optimized `/dist` directory.