let currentsong = new Audio();
let songs;
let currFolder;
let allSongs = [];

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
}

async function getsong(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/info.json`);
    let response = await a.json();
    songs = response.songs;
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `<li> 
            <img class="invert" src="ima/music.svg" alt="">
            <div class="info">
                <div>${song}</div>
                <div>Naats</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="ima/play.svg" alt="">
            </div> 
        </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return songs;
}

const playmusic = (track, pause = false) => {
    currentsong.src = `/${currFolder}/${track}`;
    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    setTimeout(() => {
        document.querySelectorAll(".songlist li").forEach(li => {
            const name = li.querySelector(".info div")?.innerText.trim();
            const trackName = decodeURI(track).trim();

            if (name === trackName || name + ".mp3" === trackName) {
                li.style.backgroundColor = "#333941ff";
                li.style.color = "white";
            } else {
                li.style.backgroundColor = "";
                li.style.color = "";
            }
        });
    }, 100);

    currentsong.onended = () => {
        let index = songs.indexOf(track);
        if (index !== -1 && index + 1 < songs.length) {
            playmusic(songs[index + 1]);
        }
    };
};

async function displayAlbums() {
    let res = await fetch("songs/albums.json");
    let folders = await res.json();
    let cardContainer = document.querySelector(".cardContainer");

    for (const folder of folders) {
        let a = await fetch(`songs/${folder}/info.json`);
        let response = await a.json();

        cardContainer.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="circle-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 3 24 24" width="25" height="25">
                        <path fill="black" d="M8 5v14l11-7z" />
                    </svg>
                </div>
                <img src="songs/${folder}/cover.png" alt="">
                <h2>${response.Title}</h2>
                <p>${response.Description}</p>
            </div>`;
    }

    Array.from(document.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", async item => {
            songs = await getsong(`songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]);
        });
    });
}

async function loadAllSongs() {
    let res = await fetch("songs/albums.json");
    let folders = await res.json();

    for (const folder of folders) {
        let songsInAlbum = await getsong(`songs/${folder}`);
        allSongs.push(...songsInAlbum);
    }

    document.getElementById("searchSongs").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const songUL = document.querySelector(".songlist ul");
        songUL.innerHTML = "";

        const filteredSongs = allSongs.filter(song => song.toLowerCase().startsWith(query));

        filteredSongs.forEach(song => {
            songUL.innerHTML += `<li> 
                <img class="invert" src="img/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Sami Saifi</div>
                </div>
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </li>`;
        });

        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                let track = e.querySelector(".info").firstElementChild.innerHTML.trim();
                playmusic(track);
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayAlbums();
    loadAllSongs();
});
