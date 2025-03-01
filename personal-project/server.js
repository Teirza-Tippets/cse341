const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const cors = require("cors");
const movieRoutes = require("./routes/movies");
const setupSwagger = require("./swagger");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

// Auth0 Configuration
const config = {
  authRequired: false,  
  auth0Logout: true,    
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

// Middleware: Attach authentication routes
app.use(auth(config));

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "movieWatchlist";

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    app.locals.db = client.db(DB_NAME);
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, "public")));

// Use movie routes
app.use("/movies", movieRoutes);

// Home Route (Check if user is authenticated)
app.get("/login", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

// Protected Profile Route
app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

// Protected API Route: Fetch Movies from MongoDB
app.get("/movies", requiresAuth(), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const movies = await db.collection("movies").find().toArray();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend is running on http://localhost:${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}/movies`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

