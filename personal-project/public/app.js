import { loadMovies } from './controllers/controller.js';

document.getElementById("googleLogin").addEventListener("click", () => {
    window.location.href = "/auth/google";
  });
  
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
});

