
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { OAuth2Client } = require("google-auth-library");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.SESSION_SECRET) {
  throw new Error("Please configure GOOGLE_CLIENT_ID and SESSION_SECRET in .env");
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const db = new Database("users.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    picture TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(session({
  name: "google_auth_session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.get("/", (req, res) => {
  res.send("Google OAuth backend is running!");
});

app.post("/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required"
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub ||
        !payload.email || payload.email_verified !== true) {
      return res.status(401).json({
        message: "Google account verification failed"
      });
    }

    let user = db.prepare(`
      SELECT id, google_id, name, email, picture
      FROM users WHERE google_id = ?
    `).get(payload.sub);

    if (!user) {
      const existing = db.prepare(
        "SELECT id FROM users WHERE email = ?"
      ).get(payload.email);

      if (existing) {
        return res.status(409).json({
          message: "An account with this email already exists."
        });
      }

      const result = db.prepare(`
        INSERT INTO users (google_id, name, email, picture)
        VALUES (?, ?, ?, ?)
      `).run(
        payload.sub,
        payload.name || payload.email,
        payload.email,
        payload.picture || null
      );

      user = db.prepare(`
        SELECT id, google_id, name, email, picture
        FROM users WHERE id = ?
      `).get(result.lastInsertRowid);
    }

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({
          message: "Unable to create session"
        });
      }

      req.session.userId = user.id;

      req.session.save((saveError) => {
        if (saveError) {
          return res.status(500).json({
            message: "Unable to save session"
          });
        }

        res.json({
          message: "Google login successful",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture
          }
        });
      });
    });
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({
      message: "Google authentication failed."
    });
  }
});

app.get("/auth/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = db.prepare(`
    SELECT id, name, email, picture
    FROM users WHERE id = ?
  `).get(req.session.userId);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  res.json({ user });
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("google_auth_session", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.json({ message: "Logged out successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
