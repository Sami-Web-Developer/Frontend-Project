let currentsong = new Audio();
let songs = [];
let currFolder = "";

function formatTime(seconds) {
  let mins = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
}

async function getsong(folder) {
  currFolder = folder;
  const res = await fetch(`https://sami-web-developer.github.io/Frontend-Project/${folder}/playlist.json`);
  const list = await res.json();
  songs = list;

  const songul = document.querySelector(".songlist ul");
  songul.innerHTML = list.map(song => `
    <li>
      <img class="invert" src="https://sami-web-developer.github.io/Frontend-Project/img/music.svg" alt="">
      <div class="info"><div>${song.replaceAll("%20", " ")}</div><div>Sami Saifi</div></div>
      <span>Play Now</span>
      <img class="invert" src="https://sami-web-developer.github.io/Frontend-Project/img/play.svg" alt="">
    </li>`).join("");

  Array.from(songul.children).forEach(li => {
    li.addEventListener("click", () => {
      const track = li.querySelector(".info div").innerText.trim();
      playmusic(track);
    });
  });

  return list;
}


function playmusic(track, pause = false) {
  currentsong.src = `https://sami-web-developer.github.io/Frontend-Project/${currFolder}/` + encodeURIComponent(track);
  if (!pause) {
    currentsong.play();
    play.src = "https://sami-web-developer.github.io/Frontend-Project/img/pause.svg";
  }
  document.querySelector(".songinfo").innerText = decodeURI(track);
  document.querySelector(".songtime").innerText = "00:00 / 00:00";

  setTimeout(() => {
    document.querySelectorAll(".songlist li").forEach(li => {
      const name = li.querySelector(".info div").innerText.trim();
      li.style.backgroundColor = (name === decodeURI(track).trim()) ? "#333941ff" : "";
      li.style.color = (name === decodeURI(track).trim()) ? "white" : "";
    });
  }, 100);

  currentsong.onended = () => {
    let idx = songs.indexOf(track);
    if (idx !== -1 && idx + 1 < songs.length) playmusic(songs[idx + 1]);
  };
}

async function displayAlbums() {
  const res = await fetch("https://sami-web-developer.github.io/Frontend-Project/songs/albums.json");
  const folders = await res.json();
  const cardContainer = document.querySelector(".cardContainer");

  folders.forEach(async folder => {
    const res2 = await fetch(`https://sami-web-developer.github.io/Frontend-Project/songs/${folder}/info.json`);
    const info = await res2.json();
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.folder = folder;
    card.innerHTML = `
      <div class="circle-icon">
        <svg …></svg>
      </div>
      <img src="https://sami-web-developer.github.io/Frontend-Project/songs/${folder}/cover.png" alt="">
      <h2>${info.Title}</h2>
      <p>${info.Description}</p>`;
    card.onclick = async () => {
      await getsong(`songs/${folder}`);
      playmusic(songs[0]);
    };
    cardContainer.appendChild(card);
  });
}

async function loadAllSongs() {
  const res = await fetch("https://sami-web-developer.github.io/Frontend-Project/songs/albums.json");
  const folders = await res.json();
  const allSongs = [];

  for (const folder of folders) {
    const list = await getsong(`songs/${folder}`);
    allSongs.push(...list);
  }

  document.getElementById("searchSongs").addEventListener("input", function () {
    const filtered = allSongs.filter(s => s.toLowerCase().startsWith(this.value.toLowerCase()));
    const ul = document.querySelector(".songlist ul");
    ul.innerHTML = filtered.map(song => `
      <li>
        <img class="invert" src="https://sami-web-developer.github.io/Frontend-Project/img/music.svg" alt="">
        <div class="info"><div>${song.replaceAll("%20", " ")}</div><div>Sami Saifi</div></div>
        <span>Play Now</span>
        <img class="invert" src="https://sami-web-developer.github.io/Frontend-Project/img/play.svg" alt="">
      </li>`).join("");
    Array.from(ul.children).forEach(li => {
      li.onclick = () => playmusic(li.querySelector(".info div").innerText.trim());
    });
  });
}

async function main() {
  await getsong("songs/ncs");
  playmusic(songs[0], true);
  await displayAlbums();
  loadAllSongs();

  document.getElementById("play").onclick = () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "https://sami-web-developer.github.io/Frontend-Project/img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "https://sami-web-developer.github.io/Frontend-Project/img/play.svg";
    }
  };
  
  previous?.addEventListener("click", () => {
    let idx = songs.indexOf(currentsong.src.split("/").pop());
    if (idx > 0) playmusic(songs[idx - 1]);
  });
  next?.addEventListener("click", () => {
    let idx = songs.indexOf(currentsong.src.split("/").pop());
    if (idx + 1 < songs.length) playmusic(songs[idx + 1]);
  });

  // SeekBar & Volume logic unchanged...
}

main();
