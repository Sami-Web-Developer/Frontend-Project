
// ✅ UPDATED JavaScript for GitHub Pages (NO local IPs)
let currentsong = new Audio();
let songs;
let currFolder;

// Get all folders (albums)
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`songs/${folder}/info.json`);
  songs = await a.json();

  // Set the first song by default
  currentsong.src = `songs/${folder}/` + songs[0].track;
  document.querySelector(".songinfo").innerHTML = songs[0].track.replaceAll("%20", " ");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

  // Show all songs in list
  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  for (const song of songs) {
    songul.innerHTML += `<li> 
      <img class="invert" src="images/music.svg" alt="">
      <div class="info">
        <div>${song.track.replaceAll("%20", " ")}</div>
        <div>Artist Name</div>
      </div>
      <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="images/play.svg" alt="">
      </div>
    </li>`;
  }

  // Add click events to all "li" to play songs
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e, i) => {
    e.addEventListener("click", () => {
      playmusic(songs[i].track);
    });
  });
}

// Format time to mm:ss
const formatTime = (timeInSec) => {
  let minutes = Math.floor(timeInSec / 60);
  let seconds = Math.floor(timeInSec % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Play music function
const playmusic = (track) => {
  currentsong.src = `songs/${currFolder}/` + track;
  currentsong.play();
  document.querySelector(".play").src = "images/pause.svg";
  document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ");
};

// Load folders/albums on page load
async function displayAlbums() {
  let a = await fetch(`songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  let folders = Array.from(anchors)
    .map(e => e.href.split("/").slice(-2)[0])
    .filter(e => !e.includes("songs"));

  for (let folder of folders) {
    let info = await fetch(`songs/${folder}/info.json`);
    let infoData = await info.json();

    cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
      <div class="play">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M5.25 5.653v12.693M18.75 5.653v12.693M5.25 5.653C5.25 4.74 6.063 4 7.125 4h2.625c1.063 0 1.875.74 1.875 1.653v12.693c0 .913-.812 1.654-1.875 1.654H7.125c-1.062 0-1.875-.741-1.875-1.654V5.653zm13.5 0c0-.913-.812-1.653-1.875-1.653h-2.625c-1.063 0-1.875.74-1.875 1.653v12.693c0 .913.812 1.654 1.875 1.654h2.625c1.063 0 1.875-.741 1.875-1.654V5.653z" />
        </svg>
      </div>
      <img src="songs/${folder}/cover.jpeg" alt="">
      <h2>${infoData.title}</h2>
      <p>${infoData.description}</p>
    </div>`;
  }

  // Add click events to cards
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      let folder = item.currentTarget.dataset.folder;
      getSongs(folder);
    });
  });
}

// Set up play/pause toggle
document.querySelector(".play").addEventListener("click", () => {
  if (currentsong.paused) {
    currentsong.play();
    document.querySelector(".play").src = "images/pause.svg";
  } else {
    currentsong.pause();
    document.querySelector(".play").src = "images/play.svg";
  }
});

// Time update & seekbar
currentsong.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
  document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
});

document.querySelector(".seekbar").addEventListener("click", e => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width);
  currentsong.currentTime = percent * currentsong.duration;
});

// Volume control
document.querySelector(".range input").addEventListener("change", (e) => {
  currentsong.volume = parseInt(e.target.value) / 100;
});

// Load albums on page load
displayAlbums();
