const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Validation middleware
const validateMovie = (req, res, next) => {
  const { title, director, genre, releaseYear, rating, watched } = req.body;
  if (!title || !director || !genre || typeof releaseYear !== 'number' || typeof rating !== 'number' || typeof watched !== 'boolean') {
    return res.status(400).json({
      message: 'All fields (title, director, genre, releaseYear, rating, watched) are required with correct data types.'
    });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: API endpoints for managing movies
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Retrieve all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 */
router.get('/', async (req, res) => {
  try {
    const movies = await req.app.locals.db.collection('movies').find().toArray();
    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Retrieve a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: A movie object
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Movie not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid movie ID format' });
    }
    const movie = await req.app.locals.db.collection('movies').findOne({ _id: new ObjectId(id) });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    console.error('Error fetching movie:', err);
    res.status(500).json({ message: 'Failed to fetch movie' });
  }
});

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               director:
 *                 type: string
 *               genre:
 *                 type: string
 *               releaseYear:
 *                 type: number
 *               rating:
 *                 type: number
 *               watched:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/', validateMovie, async (req, res) => {
  try {
    const newMovie = req.body;
    const result = await req.app.locals.db.collection('movies').insertOne(newMovie);
    res.status(201).json({ message: 'Movie added', id: result.insertedId, movie: newMovie });
  } catch (err) {
    console.error('Error adding movie:', err);
    res.status(500).json({ message: 'Failed to add movie' });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update an existing movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               director:
 *                 type: string
 *               genre:
 *                 type: string
 *               releaseYear:
 *                 type: number
 *               rating:
 *                 type: number
 *               watched:
 *                 type: boolean
 *     responses:
 *       204:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Movie not found
 */
router.put('/:id', validateMovie, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const result = await req.app.locals.db.collection('movies').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Movie not found' });
    res.status(204).end();
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(500).json({ message: 'Failed to update movie' });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Movie not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const result = await req.app.locals.db.collection('movies').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ message: 'Failed to delete movie' });
  }
});

module.exports = router;

