const API_KEY = "b0ecaf9b"
const searchForm = document.getElementById("search-form");
const movieList = document.getElementById("movie-list");
const currentMovies = []

displayEmptyPopUp()

function displayEmptyPopUp() {
    movieList.innerHTML = `
        <div id="find-movie-pop-up">
            <img src="img/movie.png" alt="movie icon">
            <p>Start exploring</p>
        </div>
    `
}

function displayPopUp(message) {
    movieList.innerHTML = `
        <div id="find-movie-pop-up">
            <p>${message}</p>
        </div>
    `
}

function hidePopUp() {
    movieList.innerHTML = "";
}

function addMovie(index) {
    let watchlist = localStorage.getItem("watchlist")
    if (!watchlist) {
        localStorage.setItem("watchlist", "{}")
        watchlist = {}
    }
    else {
        watchlist = JSON.parse(watchlist)
    }
    const selectedMovie = currentMovies[index]
    watchlist[selectedMovie.imdbID] = {
        "Poster" : selectedMovie.Poster,
        "Title" : selectedMovie.Title,
        "imdbRating" : selectedMovie.imdbRating,
        "Runtime" : selectedMovie.Runtime,
        "Genre" : selectedMovie.Genre,
        "Plot" : selectedMovie.Plot
    }
    console.log(watchlist)
    localStorage.setItem("watchlist",JSON.stringify(watchlist))
}

async function generateMoviesHtml(moviesList) {
    let movieHtml = ""
    let index = 0
    currentMovies.length = 0
    for (const movie of moviesList) {
        const endpoint = `https://www.omdbapi.com/?i=${movie["imdbID"]}&apikey=${API_KEY}`
        const res = await fetch(endpoint)
        const movieDetail = await res.json()
        currentMovies.push({
            "imdbID" : movie.imdbID,
            "Poster" : movieDetail.Poster,
            "Title" : movieDetail.Title,
            "imdbRating" : movieDetail.imdbRating,
            "Runtime" : movieDetail.Runtime,
            "Genre" : movieDetail.Genre,
            "Plot" : movieDetail.Plot
        })
        movieHtml += `
            <div class="movie-card">
                <img class="movie-image" src="${movieDetail.Poster}" alt="${movieDetail.Title} Poster">
                <div class="movie-details">
                    <div class="title">
                        <h2>${movieDetail.Title}</h2>
                        <img src="img/star.png" alt="movie rating star">
                        <span class="movie-score">${movieDetail.imdbRating}</span>
                    </div>
                    <div class="detail">
                        <p>${movieDetail.Runtime}</p>
                        <p>${movieDetail.Genre}</p>
                        <button class="add-watchlist" onclick="addMovie(${index})">
                            <img src="img/add.png" alt="add movie icon">
                            Watchlist
                        </button>
                    </div>
                    <p class="description">
                        ${movieDetail.Plot}
                    </p>
                </div>
            </div>
        `
        index++
    }
    return movieHtml
}

async function getMovies(title) {
    const endpoint = `https://www.omdbapi.com/?s=${title}&apikey=${API_KEY}`
    const res = await fetch(endpoint)
    const data = await res.json()
    if (data["Response"] === "False") {
        displayPopUp(data["Error"])
    }
    else {
        hidePopUp()
        const movies = data["Search"]
        movieList.innerHTML = await generateMoviesHtml(movies)
    }
}

searchForm.addEventListener("submit", (e)=> {
    const formData = new FormData(searchForm)
    e.preventDefault()
    getMovies(formData.get("title"))
    searchForm.reset()
});