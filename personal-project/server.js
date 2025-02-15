const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const cors = require("cors");
const movieRoutes = require("./routes/movies");
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "movieWatchlist";

MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    app.locals.db = client.db(DB_NAME);
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Use movie routes
app.use("/movies", movieRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/movies`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
