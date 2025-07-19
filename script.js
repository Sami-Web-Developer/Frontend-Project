
  let currentsong = new Audio();

  let songs;
  let currFolder;

function formatTime(seconds) {
  let mins = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);

  // Add leading zero if needed
  mins = mins < 10 ? "0" + mins : mins;
  secs = secs < 10 ? "0" + secs : secs;

  return `${mins}:${secs}`;
}



async function getsong(folder) {
currFolder = folder;
  let a = await fetch(`https://sami-web-developer.github.io/Frontend-Project/${folder}/playlist.json`)
  let response = await a.json();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    // if (element.href.endsWith("mp3")) {
    //   song.push(element.href.split(`/${folder}/`)[1])

         if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]); // ✅ CORRECT
    }

    }
  
  

  // show all the song in play list


  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songul.innerHTML = ""
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li> 
                        <img class="invert" src="https://sami-web-developer.github.io/Frontend-Project/img/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>Sami Saifi</div>
                        </div>
                        <span>Play Now</span>
                        <img class="invert" src="https://sami-web-developer.github.io/Frontend-Project/img/play.svg" alt="">
                        </li>`;
  }

  // attach eventlistener to each song

//   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
//     e.addEventListener("click",element=>{
//       console.log(e.querySelector(".info").firstElementChild.innerHTML)
// playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
//     })
//   })

//   return songs
// }

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      let track = e.querySelector(".info").firstElementChild.innerHTML.trim();
      console.log("track:", track);
      playmusic(track);
      console.log("track:", track);
    });
  });

  return songs; }// ✅ Now it returns after everything is ready



console.log("track:", track);

const playmusic= (track,pause=false ) =>{ 
  // let audio = new Audio("/Naats/" + track)
  
  
  currentsong.src = `https://sami-web-developer.github.io/Frontend-Project/${currFolder}/` + encodeURIComponent(track);
  if(!pause){
    currentsong.play();
    play.src = "https://sami-web-developer.github.io/Frontend-Project/img/pause.svg";
    console.log("track:", track);
  }
   document.querySelector(".songinfo").innerHTML = decodeURI(track)
   document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
console.log("track:", track);


// 🔄 Highlight the currently playing so

setTimeout(() => {
  document.querySelectorAll(".songlist li").forEach(li => {
    const name = li.querySelector(".info div")?.innerText.trim();
    const trackName = decodeURI(track).trim();

    if (name === trackName || name + ".mp3" === trackName) {
      li.style.backgroundColor = "#333941ff"; // Or any color you like
      li.style.color = "white";
    } else {
      li.style.backgroundColor = "";
      li.style.color = "";
    }
  });
}, 100); // slight delay to make sure song list is rendered



currentsong.onended = () => {
  let index = songs.indexOf(track);
  if (index !== -1 && index + 1 < songs.length) {
    playmusic(songs[index + 1]);
  }
};


  }

async function displayAlbums() {
    let a = await fetch(`https://sami-web-developer.github.io/Frontend-Project/songs/albums.json`)
  let response = await a.json();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
   let cardContainer = document.querySelector(".cardContainer")
 
 let array = Array.from (anchors)
for (let index = 0; index < array.length; index++) {
  const e = array[index];
  



    if(e.href.includes("/songs")){
      let folder = e.href.split("/").slice(-2)[0]
      // get the matadata of the folder
          let a = await fetch(`https://sami-web-developer.github.io/Frontend-Project/songs/${folder}/info.json`)
  let response = await a.json();

  cardContainer.innerHTML = cardContainer.innerHTML + `               <div  data-folder="${folder}" class="card">
                    <div class="circle-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 3 24 24" width="25" height="25">
                            <path fill="black" d="M8 5v14l11-7z" />
                        </svg>
                        </svg>
                    </div>
                    <img  src="https://sami-web-developer.github.io/Frontend-Project/songs/${folder}/cover.png" alt="">
                    <h2>${response.Title}</h2>
                    <p>${response.Description}</p>
                </div>`
    }
  }

// load the play list whenever card is clicked


Array.from(document.getElementsByClassName("card")).forEach(element => {

  element.addEventListener("click",async item=>{
    songs = await getsong(`songs/${item.currentTarget.dataset.folder}`);
    playmusic(songs[0])
  })
});

}


// get the list of the song
async function main() {
   songs = await getsong("songs/ncs");

playmusic(songs[0],true)


// display all the albums on the page

displayAlbums();


  // attach eventlistener to play,

play.addEventListener("click",()=>{
  if(currentsong.paused){
    currentsong.play()
    
    play.src = "https://sami-web-developer.github.io/Frontend-Project/img/pause.svg"
  }
  else{
    currentsong.pause();
    
    play.src = "https://sami-web-developer.github.io/Frontend-Project/img/play.svg"
  }
})


// listen for time update Event

currentsong.addEventListener("timeupdate",()=>{
 
  document.querySelector(".songtime").innerHTML=`${
    formatTime (currentsong.currentTime)}/${formatTime (currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration)*100 + "%";
})

// add an eventlistener to seekbar



document.querySelector(".seekbar").addEventListener("click",e=>{
  let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
 document.querySelector(".circle").style.left= percent + "%";
 currentsong.currentTime = ((currentsong.duration)*percent)/100
})


// add eventlistner for hamburger

document.querySelector(".hamburger").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "0"
})



// all addEventListener for close button


document.querySelector(".close").addEventListener("click",()=>{
document.querySelector(".left").style.left = "-100%"
})

// addEventListener to previous and next


previous.addEventListener("click",()=>{

  let index = songs.indexOf(currentsong.src.split("/").splice(-1)[0])
  if((index-1) >= 0){
    playmusic(songs[index-1])
  }
})

next.addEventListener("click",()=>{

  let index = songs.indexOf(currentsong.src.split("/").splice(-1)[0])
  

  if((index+1) < songs.length){
    playmusic(songs[index+1])
  }
})

// add Event to volume

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{

  currentsong.volume=parseInt(e.target.value)/100
  if(currentsong.volume > 0){
    document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
  }
})


// add addEventListener to mute the volume

document.querySelector(".volume>img").addEventListener("click",e=>{

if(e.target.src.includes("volume.svg")){
  e.target.src = e.target.src.replace("volume.svg","mute.svg")
  currentsong.volume = 0;
  document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
}
else{
  e.target.src = e.target.src.replace("mute.svg","volume.svg")
  currentsong.volume = 0.10;
  document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
}
})




let allSongs = []; // Global array

async function loadAllSongs() {
    let res = await fetch("https://sami-web-developer.github.io/Frontend-Project/songs/albums.json");
    let text = await res.json();

    let div = document.createElement("div");
    div.innerHTML = text;
    let anchors = div.getElementsByTagName("a");

    for (let a of anchors) {
        if (a.href.includes("/songs/")) {
            let folder = a.href.split("/").slice(-2)[0];
            let songsInAlbum = await getsong(`songs/${folder}`);
            allSongs.push(...songsInAlbum); // Fill the array
        }
    }

    // ✅ Move search event listener HERE, after songs are loaded
    document.getElementById("searchSongs").addEventListener("input", function () {
        let searchValue = this.value.toLowerCase();
        let filtered = allSongs.filter(song => song.toLowerCase().startsWith(searchValue)); // ✅ ONLY starts with

        let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
        songul.innerHTML = "";

        for (const song of filtered) {
            songul.innerHTML += `<li> 
                <img class="invert" src="https://sami-web-developer.github.io/Frontend-Project/img/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Sami Saifi</div>
                </div>
                <span>Play Now</span>
                <img class="invert" src="https://sami-web-developer.github.io/Frontend-Project/img/play.svg" alt="">
            </li>`;
        }

        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                let track = e.querySelector(".info").firstElementChild.innerHTML.trim();
                playmusic(track); // Play the clicked song
            });
        });
    });
}

// Call the function
loadAllSongs();









document.querySelectorAll(".logo img, .logo p").forEach(el => {
    el.style.cursor = "pointer";  // Optional: makes it look clickable
    el.addEventListener("click", () => {
        window.location.href = "https://sami-web-developer.github.io/Frontend-Project/";
    });
});
document.querySelectorAll(".hm img, .hm p").forEach(el => {
    el.style.cursor = "pointer";  // Optional: makes it look clickable
    el.addEventListener("click", () => {
        window.location.href = "https://sami-web-developer.github.io/Frontend-Project/";
    });
});





document.querySelector(".signup").addEventListener("click", e=>{
  alert("There is no sign-in page.")
})
document.querySelector(".login").addEventListener("click", e=>{
  alert("There is no login page.")
})

















}
main()