export function renderMovies(movies) {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';
    movies.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('movie-card');
        div.innerHTML = `
            <h3>${movie.title}</h3>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Release Year:</strong> ${movie.releaseYear}</p>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Rating:</strong> ${movie.rating}/10</p>
        `;
        container.appendChild(div);
    });
}
