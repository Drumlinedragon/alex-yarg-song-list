const songCount = document.getElementById("songCount");
const artistCount = document.getElementById("artistCount");
const genreCount = document.getElementById("genreCount");
const tableBody = document.querySelector("#songTable tbody");
const searchBox = document.getElementById("searchBox");
const albumCount = document.getElementById("albumCount");

let allSongs = [];
let currentSort = "";
let ascending = true;
function displaySongs(songList) {

    tableBody.innerHTML = "";

    songList.forEach(song => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${song.Artist}</td>
            <td>${song.Name}</td>
            <td>${song.Album}</td>
            <td>${song.Year}</td>
        `;
row.addEventListener("click", () => showSongDetails(song));
        tableBody.appendChild(row);

    });

}
function updateSortArrows() {
    document.getElementById("artistHeader").textContent = "Artist";
    document.getElementById("songHeader").textContent = "Song";
    document.getElementById("albumHeader").textContent = "Album";
    document.getElementById("yearHeader").textContent = "Year";

    const arrow = ascending ? " ▲" : " ▼";

    if (currentSort === "Artist") {
        document.getElementById("artistHeader").textContent = "Artist" + arrow;
    } else if (currentSort === "Name") {
        document.getElementById("songHeader").textContent = "Song" + arrow;
    } else if (currentSort === "Album") {
        document.getElementById("albumHeader").textContent = "Album" + arrow;
    } else if (currentSort === "Year") {
        document.getElementById("yearHeader").textContent = "Year" + arrow;
    }
}
function sortSongs(field) {

    if (currentSort === field) {
        ascending = !ascending;
    } else {
        currentSort = field;
        ascending = true;
    }

    allSongs.sort((a, b) => {

        let valueA = a[field];
        let valueB = b[field];

        if (field === "Year") {
            valueA = Number(valueA);
            valueB = Number(valueB);
        } else {
            valueA = valueA.toString().toLowerCase();
            valueB = valueB.toString().toLowerCase();
        }

        if (valueA < valueB) return ascending ? -1 : 1;
        if (valueA > valueB) return ascending ? 1 : -1;
        return 0;

    });

    updateSortArrows();
    displaySongs(allSongs);
}
function showSongDetails(song) {
    console.log("Selected song:", song);

    document.getElementById("detailArtist").textContent = song.Artist;
    document.getElementById("detailSong").textContent = song.Name;
    document.getElementById("detailAlbum").textContent = song.Album;
    document.getElementById("detailYear").textContent = song.Year;
    document.getElementById("detailGenre").textContent = song.Genre;
    document.getElementById("detailCharter").textContent = song.Charter;

    document.getElementById("songDetails").style.display = "block";
}

function randomSong() {
    console.log("Random button clicked!");

    if (allSongs.length === 0) {
        console.warn("No songs are loaded.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * allSongs.length);
    const song = allSongs[randomIndex];

    console.log("Random song:", song);

    showSongDetails(song);

 
}
async function loadSongs() {

    try {

        const response = await fetch("data/songs.json");

        allSongs = await response.json();

        songCount.textContent = allSongs.length.toLocaleString();

        artistCount.textContent =
            new Set(allSongs.map(song => song.Artist)).size.toLocaleString();

        genreCount.textContent =
            new Set(allSongs.map(song => song.Genre)).size.toLocaleString();
albumCount.textContent =
    new Set(allSongs.map(song => song.Album)).size.toLocaleString();
        displaySongs(allSongs);

    } catch(error) {

        console.error(error);

    }

}

searchBox.addEventListener("input", () => {

    const search = searchBox.value.toLowerCase();

    const filtered = allSongs.filter(song =>

        song.Artist.toLowerCase().includes(search) ||

        song.Name.toLowerCase().includes(search) ||

        song.Album.toLowerCase().includes(search) ||

        song.Year.toString().includes(search)

    );

    displaySongs(filtered);

});
const randomButton = document.getElementById("randomButton");

if (randomButton) {
    randomButton.addEventListener("click", randomSong);
    console.log("Random Song button connected!");
} else {
    console.error("Random Song button was not found.");
}

loadSongs();

window.sortSongs = sortSongs;
