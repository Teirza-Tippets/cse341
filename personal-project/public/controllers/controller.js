import { fetchMovies } from '../models/model.js';
import { renderMovies } from '../views/view.js';

export async function loadMovies() {
    const movies = await fetchMovies();
    renderMovies(movies);
}
