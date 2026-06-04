const BASE_URL = "http://www.omdbapi.com/?apikey=23d1ebb4&";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resultsGrid = document.getElementById("results");

async function searchMovies(query) {
  const response = await fetch(`${BASE_URL}s=${(query)}`);
  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  return data.Search;
}

async function getMovieDetails(imdbID) {
  const response = await fetch(`${BASE_URL}i=${imdbID}`);
  const data = await response.json();
  return data;
}

function renderResults(movies) {
  resultsGrid.innerHTML = movies
    .slice(0, 6)
    .map(
      (movie) => `
    <div class="movie-card">
      <img
        src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}"
        alt="${movie.Title}"
      />
      <div class="movie-card-info">
        <h3 title="${movie.Title}">${movie.Title}</h3>
        <span>${movie.Year}</span>
      </div>
    </div>
  `,
    )
    .join("");
}

function renderError(message) {
  resultsGrid.innerHTML = `<p class="search-error">${message}</p>`;
}

function renderLoading() {
  resultsGrid.innerHTML = `<p class="search-loading">Searching...</p>`;
}

async function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  if (query.length < 3) {
    renderError("Please enter at least 3 characters.");
    return;
  }

  renderLoading();

  try {
    const movies = await searchMovies(query);
    renderResults(movies);
  } catch (error) {
    renderError(error.message);
  }
}

searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});
