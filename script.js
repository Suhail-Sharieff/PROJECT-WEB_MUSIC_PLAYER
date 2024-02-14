// console.log(`lets write js`);
// alert("welcome to suhail's web")

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesAndSeconds(seconds) {
    const formattedMinutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const formattedSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
const totalSeconds = 72; // Replace with your desired number of seconds
const formattedTime = secondsToMinutesAndSeconds(totalSeconds);
console.log(`Formatted time: ${formattedTime}`); // Output: "01:12"



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
      songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
    <script src="https://cdn.lordicon.com/lordicon.js"></script>
    <lord-icon
      class="invert"
      src="https://cdn.lordicon.com/okasasci.json"
      trigger="loop"
      delay="2000"
      style="width: 45px; height: 45px"
    >
    </lord-icon>
    <div class="info">
      <div>${song.replaceAll("%20"," ")}</div>
    </div>
    <img src="play-button.png" width="25px" height="25px" alt="" />
   </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {

        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

        })

    })
 

    
   
}
// async function getSongs() {
//     let a = await fetch("http://127.0.0.1:3000/songs/")
//     let response = await a.text();

//     let div = document.createElement("div")
//     div.innerHTML = response
//     let as = div.getElementsByTagName("a")
//     let songs = []
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split("/songs/")[1])
//         }

//     }
//     return songs
// }

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track

    if (!pause) {
        currentSong.play()
        play.src = "pause.png"
    }


    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



    
}

async function main() {







    //getting list
     await getSongs("songs/nath")

    playMusic(songs[0], true)

   


   
    //next and prev 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.png"
        } else {
            currentSong.pause()
            play.src = "play-button.png"
        }
    })

    //updating the time
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)} / ${secondsToMinutesAndSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"


    })


    //adding event tos eekbar 835 max
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        document.querySelector(".circle").style.left = ((e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%");
        currentSong.currentTime = (currentSong.duration) * (e.offsetX / e.target.getBoundingClientRect().width)
    })


    //event for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })



    //event for closing  hamburger
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-140%";
    })



    //prev and next event
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) >= 0) {
            playMusic(songs[index + 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    //volume controls
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    //load playlist
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            

        })
    })

}
main()