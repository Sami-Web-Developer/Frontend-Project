
let currentsong = new Audio();
let songs;
let currFolder;
let allSongs = [];

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return \`\${mins < 10 ? "0" + mins : mins}:\${secs < 10 ? "0" + secs : secs}\`;
}

async function getsong(folder) {
    currFolder = folder;
    let a = await fetch(\`/\${folder}/info.json\`);
    let response = await a.json();
    songs = response.songs;
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += \`<li> 
            <img class="invert" src="ima/music.svg" alt="">
            <div class="info">
                <div>\${song}</div>
                <div>Naats</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="ima/play.svg" alt="">
            </div> 
        </li>\`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return songs;
}

const playmusic = (track, pause = false) => {
    currentsong.src = \`\${currFolder}/\${track}\`;
    if (!pause) {
        currentsong.play();
        play.src = "ima/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    let res = await fetch("songs/albums.json");
    let folders = await res.json();
    let cardContainer = document.querySelector(".cardContainer");

    for (const folder of folders) {
        let a = await fetch(\`songs/\${folder}/info.json\`);
        let response = await a.json();

        cardContainer.innerHTML += \`
            <div data-folder="\${folder}" class="card">
                <div class="circle-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 3 24 24" width="25" height="25">
                        <path fill="black" d="M8 5v14l11-7z" />
                    </svg>
                </div>
                <img src="songs/\${folder}/cover.png" alt="">
                <h2>\${response.Title}</h2>
                <p>\${response.Description}</p>
            </div>\`;
    }

    Array.from(document.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", async item => {
            songs = await getsong(\`songs/\${item.currentTarget.dataset.folder}\`);
            playmusic(songs[0]);
        });
    });
}

async function loadAllSongs() {
    let res = await fetch("songs/albums.json");
    let folders = await res.json();

    for (const folder of folders) {
        let songsInAlbum = await getsong(\`songs/\${folder}\`);
        allSongs.push(...songsInAlbum);
    }

    document.getElementById("searchInput").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const songUL = document.querySelector(".songlist ul");
        songUL.innerHTML = "";

        const filteredSongs = allSongs.filter(song => song.toLowerCase().includes(query));

        filteredSongs.forEach(song => {
            songUL.innerHTML += \`<li> 
                <img class="invert" src="ima/music.svg" alt="">
                <div class="info">
                    <div>\${song}</div>
                    <div>Naats</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="ima/play.svg" alt="">
                </div> 
            </li>\`;
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayAlbums();
    loadAllSongs();
});
