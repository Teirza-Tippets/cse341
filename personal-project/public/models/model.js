export async function fetchMovies() {
    const response = await fetch('/movies', {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error("Failed to fetch movies");
    }

    return response.json();
}
