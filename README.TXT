# FileDrive - Secure File Management Web Application

## Project Overview

FileDrive is a full-stack web application that allows users to securely upload, download, delete, and share files. Users can manage private files and view public files uploaded by others. Authentication is JWT-based, ensuring secure access.


## Setup Instructions

### Prerequisites

* Node.js v18+
* npm or yarn
* MongoDB (Atlas or local instance)

### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
```

4. Start the server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the React app:

```bash
npm start
```

4. Open in browser: `http://localhost:3000`

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description                 | Auth Required |
| ------ | ------------------ | --------------------------- | ------------- |
| POST   | /api/auth/register | Register a new user         | No            |
| POST   | /api/auth/login    | Login and receive JWT token | No            |
| GET    | /api/auth/me       | Get current logged-in user  | Yes           |

### File Management

| Method | Endpoint                | Description                          | Auth Required |
| ------ | ----------------------- | ------------------------------------ | ------------- |
| POST   | /api/files/upload       | Upload a new file                    | Yes           |
| GET    | /api/files/my-files     | Get files uploaded by logged-in user | Yes           |
| GET    | /api/files/public       | Get all public files                 | Yes           |
| DELETE | /api/files/delete/:id   | Delete a file by ID                  | Yes           |
| GET    | /api/files/download/:id | Download file by ID                  | Yes           |

---

## Notes

* Only authenticated users can access protected routes like Dashboard, Upload, My Files, and Public Files.
* Public files are accessible to all logged-in users.
* JWT tokens are stored in `localStorage` for session management.
