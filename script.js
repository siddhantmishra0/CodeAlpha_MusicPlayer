const tracks = [
  {
    backgroundImage: "Images/All the Little Lights.jpg",
    posterUrl: "Images/All the Little Lights.jpg",
    title: "Let Her Go",
    album: "All the Little Lights (Deluxe)",
    year: 2013,
    artist: "Passenger",
    musicPath: "songs/Let Her Go.mp3"
  },
  {
    backgroundImage: "Images/Goodbye & Good Riddance.jpg",
    posterUrl: "Images/Goodbye & Good Riddance.jpg",
    title: "All Girls Are The Same",
    album: "Goodbye & Good Riddance",
    year: 2018,
    artist: "Juice WRLD",
    musicPath: "songs/All Girls Are The Same.mp3"
  },
  {
    backgroundImage: "Images/XXXTENTACION.jpg",
    posterUrl: "Images/XXXTENTACION.jpg",
    title: "changes",
    album: "?",
    year: 2018,
    artist: "XXXTENTACION",
    musicPath: "songs/changes.mp3"
  },
  {
    backgroundImage: "Images/Legends Never Die.jpg",
    posterUrl: "Images/Legends Never Die.jpg",
    title: "Wishing Well",
    album: "Legends Never Die",
    year: 2020,
    artist: "Juice WRLD",
    musicPath: "songs/Wishing Well.mp3"
  },
  {
    backgroundImage: "Images/Daylight.jpg",
    posterUrl: "Images/Daylight.jpg",
    title: "Daylight",
    album: "Daylight",
    year: 2023,
    artist: "David Kushner",
    musicPath: "songs/Daylight.mp3"
  },
  /**/
  {
    backgroundImage: "Images/Hate Me Now.jpg",
    posterUrl: "Images/Hate Me Now.jpg",
    title: "Hate Me Now",
    album: "Hate Me Now",
    year: 2023,
    artist: "Ryan Caraveo",
    musicPath: "songs/Hate me now.mp3"
  }
];

/**
 * add eventListnere on all elements that are passed
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}
const playlist = document.querySelector("[data-music-list]");

for (let i = 0, len = tracks.length; i < len; i++) {
  playlist.innerHTML += `
  <li>
    <button class="music-item ${i === 0 ? "playing" : ""}" data-playlist-toggler data-playlist-item="${i}">
      <img src="${tracks[i].posterUrl}" width="800" height="800" alt="${tracks[i].title} Album Poster"
        class="img-cover">
     
    </button>
  </li>
  `;
}
const playlistSideModal = document.querySelector("[data-playlist]");
const playlistTogglers = document.querySelectorAll("[data-playlist-toggler]");
const overlay = document.querySelector("[data-overlay]");

const togglePlaylist = function () {
  playlistSideModal.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
}

addEventOnElements(playlistTogglers, "click", togglePlaylist);

const playlistItems = document.querySelectorAll("[data-playlist-item]");

let currentMusic = 0;
let lastPlayedMusic = 0;

const changePlaylistItem = function () {
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
}

addEventOnElements(playlistItems, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlaylistItem();
});

const playerBanner = document.querySelector("[data-player-banner]");
const playerTitle = document.querySelector("[data-title]");
const playerAlbum = document.querySelector("[data-album]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");

const audioSource = new Audio(tracks[currentMusic].musicPath);

const changePlayerInfo = function () {
  playerBanner.src = tracks[currentMusic].posterUrl;
  playerBanner.setAttribute("alt", `${tracks[currentMusic].title} Album Poster`);
  document.body.style.backgroundImage = `url(${tracks[currentMusic].backgroundImage})`;
  playerTitle.textContent = tracks[currentMusic].title;
  playerAlbum.textContent = tracks[currentMusic].album;
  playerYear.textContent = tracks[currentMusic].year;
  playerArtist.textContent = tracks[currentMusic].artist;

  audioSource.src = tracks[currentMusic].musicPath;

  audioSource.addEventListener("loadeddata", updateDuration);
  playMusic();
}

addEventOnElements(playlistItems, "click", changePlayerInfo);

/** update player duration */
const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");

/** pass seconds and get timecode format */
const getTimecode = function (duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.ceil(duration - (minutes * 60));
  const timecode = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return timecode;
}

const updateDuration = function () {
  playerSeekRange.max = Math.ceil(audioSource.duration);
  playerDuration.textContent = getTimecode(Number(playerSeekRange.max));
}
audioSource.addEventListener("loadeddata", updateDuration);
const playBtn = document.querySelector("[data-play-btn]");
let playInterval;
const playMusic = function () {
  if (audioSource.paused) {
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
}
playBtn.addEventListener("click", playMusic);
const playerRunningTime = document.querySelector("[data-running-time]");
const updateRunningTime = function () {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);

  updateRangeFill();
  isMusicEnd();
}
const ranges = document.querySelectorAll("[data-range]");
const rangeFill = document.querySelector("[data-range-fill]");
const updateRangeFill = function () {
  let element = this || ranges[0];
  const rangeValue = (element.value / element.max) * 100;
  element.nextElementSibling.style.width = `${rangeValue}%`;
}
addEventOnElements(ranges, "input", updateRangeFill);
const seek = function () {
  audioSource.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimecode(playerSeekRange.value);
}

playerSeekRange.addEventListener("input", seek);
const isMusicEnd = function () {
  if (audioSource.ended) {
    playBtn.classList.remove("active");
    audioSource.currentTime = 0;
    playerSeekRange.value = audioSource.currentTime;
    playerRunningTime.textContent = getTimecode(audioSource.currentTime);
    updateRangeFill();
  }
}
const playerSkipNextBtn = document.querySelector("[data-skip-next]");

const skipNext = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic >= tracks.length - 1 ? currentMusic = 0 : currentMusic++;
  }

  changePlayerInfo();
  changePlaylistItem();
}

playerSkipNextBtn.addEventListener("click", skipNext);
const playerSkipPrevBtn = document.querySelector("[data-skip-prev]");

const skipPrev = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic <= 0 ? currentMusic = tracks.length - 1 : currentMusic--;
  }

  changePlayerInfo();
  changePlaylistItem();
}

playerSkipPrevBtn.addEventListener("click", skipPrev);
const getRandomMusic = () => Math.floor(Math.random() * tracks.length);

const shuffleMusic = () => {
  let randomMusic = getRandomMusic();

  while (currentMusic === randomMusic) {
    randomMusic = getRandomMusic();
  }
  currentMusic = randomMusic;
}

const playerShuffleBtn = document.querySelector("[data-shuffle]");
let isShuffled = false;

const shuffle = function () {
  playerShuffleBtn.classList.toggle("active");
  isShuffled = isShuffled ? false : true;
}

playerShuffleBtn.addEventListener("click", shuffle);
const playerRepeatBtn = document.querySelector("[data-repeat]");

const repeat = function () {
  if (!audioSource.loop) {
    audioSource.loop = true;
    this.classList.add("active");
  } else {
    audioSource.loop = false;
    this.classList.remove("active");
  }
}

playerRepeatBtn.addEventListener("click", repeat);
const playerVolumeRange = document.querySelector("[data-volume]");
const playerVolumeBtn = document.querySelector("[data-volume-btn]");

const changeVolume = function () {
  audioSource.volume = playerVolumeRange.value;
  audioSource.muted = false;

  if (audioSource.volume <= 0.1) {
    playerVolumeBtn.children[0].innerHTML = `<img src="svg/volume-off.svg" class=" invert" alt="volume-mute">`;
  } else if (audioSource.volume <= 0.5) {
    playerVolumeBtn.children[0].innerHTML = `<img src="svg/volume-low.svg" class=" invert" alt="volume-low">`;
  } else {
    playerVolumeBtn.children[0].innerHTML = `<img src="svg/volume-high.svg" class=" invert" alt="volume-high">`;
  }
}

playerVolumeRange.addEventListener("input", changeVolume);
const muteVolume = function () {
  if (!audioSource.muted) {
    audioSource.muted = true;
    playerVolumeBtn.children[0].textContent = "volume_off";
  } else {
    changeVolume();
  }
}

playerVolumeBtn.addEventListener("click", muteVolume);
