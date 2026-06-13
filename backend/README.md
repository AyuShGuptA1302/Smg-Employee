# SMG Employee Management Portal - Backend API Service

This directory acts as the core backend infrastructure for the SMG Employee Management Portal. It is a robust Node.js application leveraging Express.js for REST API routing and MongoDB for persistent data storage.

---

### 1. Architectural Overview

The backend acts as the secure intermediary between the database and the frontend clients. It enforces business rules, verifies JSON Web Tokens (JWT) for authentication, and dynamically generates binary documents (PDFs) on-the-fly.

#### Core Technologies
| Technology | Role | Justification |
| :--- | :--- | :--- |
| **Node.js** | Runtime | Asynchronous, event-driven JavaScript runtime ideal for I/O heavy operations. |
| **Express.js** | Web Framework | Minimalist routing framework for handling HTTP requests and middleware. |
| **MongoDB** | Database | NoSQL document database perfectly suited for rapidly evolving HR schemas. |
| **Mongoose** | ODM | Object Data Modeling library ensuring strict schema validation within MongoDB. |
| **Bcrypt & JWT** | Security | Cryptographic libraries for hashing passwords and stateless session verification. |
| **PDFKit** | Utility | Server-side PDF generation engine constructing documents natively. |

---

### 2. Directory Structure

```text
backend/
├── models/                 # Mongoose Schema Definitions (25+ Database Entities)
│   ├── User.js             # Core Employee/Admin mapping
│   ├── Leave.js            # Leave application states
│   ├── GatePass.js         # Security tracking entities
│   └── ...                 # Other operational schemas
├── routes/                 # API Endpoint Definitions
│   └── apiRoutes.js        # Main routing controller integrating middleware & logic
├── utils/                  # Reusable Utility Functions
│   └── pdfGenerator.js     # Orchestration of PDF stream constructors
├── server.js               # Application Entry Point (Express configuration)
├── seed.js                 # Mock data initialization engine
└── package.json            # Dependency manifest
```

---

### 3. API Security & Middleware

The backend relies on strict JWT-based authentication to secure sensitive HR operations. 
- **Authentication**: When a user logs in via `/api/login`, the server cross-references the hashed password using bcrypt and generates a signed JSON Web Token holding the user's `_id` and `role`.
- **Authorization**: Protected endpoints demand the JWT be passed in the `Authorization` HTTP header (`Bearer <token>`). If the token is missing, expired, or invalid, the API actively rejects the request with a `401 Unauthorized` or `403 Forbidden` response.

---

### 4. Setup and Development Instructions

**1. Environment Variables**
Create a `.env` file in this directory containing the following strict configuration requirements:
```env
# Server Binding Port
PORT=5000

# MongoDB Connection String (Atlas URI or Local Daemon)
MONGO_URI=mongodb://localhost:27017/smg-portal

# Cryptographic Secret for JWT Signature
JWT_SECRET=your_super_secret_string_here
```

**2. Dependency Installation**
```bash
npm install
```

**3. Database Initialization (Crucial)**
Before executing the application for the first time, you must populate the local database with the necessary test schemas, Departments, and Administrator accounts.
```bash
node seed.js
```

**4. Server Execution**
Launch the Node process:
```bash
node server.js
```
*Note: For development workflows, installing and utilizing `nodemon server.js` is highly recommended to enable automatic server restarts upon file modifications.*
