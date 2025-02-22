export async function fetchMovies() {
    const response = await fetch('/movies');
    return response.json();
}
