<<<<<<< HEAD
# Google OAuth 2.0 Authentication

A full-stack web application that allows users to sign in securely using their Google account. Built with React, Node.js, Express, and SQLite.

## Features

- Google Sign-In using OAuth 2.0
- User authentication with Google ID token verification
- User details stored in an SQLite database
- Display Google profile name, email, and profile picture
- Session-based authentication
- Restore login session after refreshing the page
- Logout functionality
- Duplicate account checks

## Tech Stack

**Frontend**
- React
- Vite
- `@react-oauth/google`

**Backend**
- Node.js
- Express.js
- `google-auth-library`
- `express-session`
- SQLite with `better-sqlite3`

## Project Structure

```text
google-auth-app/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env
│   └── package.json
├── server/
│   ├── server.js
│   ├── .env
│   └── users.db
├── .gitignore
└── README.md
```

Environment files and the SQLite database should remain local and should not be committed to GitHub.

## Prerequisites

- Node.js and npm
- A Google account
- A Google Cloud project with OAuth 2.0 credentials

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd google-oauth-login
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

Create a `client/.env` file:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

### 3. Install backend dependencies

Open a second terminal:

```bash
cd server
npm install
```

Create a `server/.env` file:

```env
PORT=5000
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
SESSION_SECRET=YOUR_LONG_RANDOM_SECRET
CLIENT_URL=http://localhost:5173
```

Use the same Google Client ID in both environment files. Generate a strong, private session secret and never publish it.

### 4. Configure Google OAuth

In the Google Cloud Console, configure an OAuth 2.0 Client ID for a Web application.

Add this authorized JavaScript origin:

```text
http://localhost:5173
```

Ensure your Google Client ID matches the environment variables.

### 5. Start the backend

From the `server` folder:

```bash
node server.js
```

The backend runs at:

```text
http://localhost:5000
```

### 6. Start the frontend

From the `client` folder, in a separate terminal:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Authentication Flow

1. The user clicks Sign in with Google.
2. Google provides an ID token to the frontend.
3. The frontend sends the token to the Express backend.
4. The backend verifies the token with Google's authentication library.
5. The user's details are stored or retrieved from SQLite.
6. The server creates a session.
7. The frontend displays the user's profile details.

## Security Notes

- Never commit `.env` files, Google client secrets, session secrets, or database files.
- Use HTTPS and secure cookie settings in production.
- Replace the default in-memory session store with a persistent session store before deployment.
- Configure production CORS origins carefully.

## Future Improvements

- User profile dashboard
- Improved error handling
- Account management
- Production deployment

## Author

Developed as a full-stack authentication project to learn React, Node.js, Google OAuth 2.0, Express sessions, and SQLite.
=======
# google-oauth-login
Google OAuth 2.0 authentication using React, Node.js, Express, and SQLite
>>>>>>> 3987a538484293a04e5f3103b540b8ef894bff48
