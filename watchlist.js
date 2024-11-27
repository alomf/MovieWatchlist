let watchlist
const movieList = document.querySelector('#movie-list');
fetchWatchList()
renderWatchlist()

function fetchWatchList() {
    watchlist = localStorage.getItem('watchlist');
    if (!watchlist) {
        watchlist = "{}"
    }
    watchlist = JSON.parse(watchlist)
}

function renderWatchlist() {
    let movieHtml = ""
    for (let [id, detail] of Object.entries(watchlist)) {
        movieHtml += `
        <div class="movie-card">
            <img class="movie-image" src="${detail.Poster}" alt="${detail.Title} Poster">
            <div class="movie-details">
                <div class="title">
                    <h2>${detail.Title}</h2>
                    <img src="img/star.png" alt="movie rating star">
                    <span class="movie-score">${detail.imdbRating}</span>
                </div>
                <div class="detail">
                    <p>${detail.Runtime}</p>
                    <p>${detail.Genre}</p>
                    <button class="add-watchlist" onclick="removeMovie('${id}')">
                        <img src="img/delete.png" alt="delete watchlist icon">
                        Watchlist
                    </button>
                </div>
                <p class="description">
                    ${detail.Plot}
                </p>
            </div>
        </div>
        `
    }
    movieList.innerHTML = movieHtml;
}

function removeMovie(imdbID) {
    delete watchlist[imdbID];
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    renderWatchlist()
}