const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const cors = require("cors");
const setupSwagger = require("./swagger");
require("./config/passport");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movies");

dotenv.config();

if (!process.env.MONGO_URI || !process.env.SESSION_SECRET || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Missing environment variables");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

// Session Configuration (Needed for Google OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }, // Secure cookie in production
  })
);

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log("Connected to MongoDB");
    app.locals.db = client.db("movieWatchlist"); // Store DB reference
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);

// Google OAuth Login Route
app.get("/login", (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Protected Profile Route
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});

// Protected API Route: Fetch Movies from MongoDB
app.get("/movies", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next(); // Pass request to fetch movies
}, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const movies = await db.collection("movies").find().toArray();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, "public")));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Google OAuth login at http://localhost:${PORT}/login`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
