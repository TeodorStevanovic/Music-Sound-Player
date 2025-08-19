const playlistSongs = document.getElementById("playlist");
const addSongForm = document.getElementById("songForm");
const formContainer = document.getElementById("form-container");
const playButton = document.getElementById("playBtn");
const prevButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");
const shuffleButton = document.getElementById("shuffleBtn");
const sortSongsDropdownList = document.getElementById("sortSelect");
const nowPlayDiv = document.getElementById("now-playing");
const searchInputSong = document.getElementById("searchInput");
const openFormBtn = document.getElementById("openFormBtn");
const titleSong = document.getElementById("title");
const artistSong = document.getElementById("artist");
const albumSong = document.getElementById("album");
const durationSong = document.getElementById("duration");
const imgSong = document.getElementById("img");
const srcSong = document.getElementById("src");

const allSongs = [
  {
    id: 0,
    album: "Brothers In Arms",
    title: "So Far Away",
    artist: "Dire Straits",
    duration: "5:06",
    src: "music/So Far Away (Remastered 1996).mp3",
    img: "album-cover/brothersinarms.jpg",
  },
  {
    id: 1,
    album: "Brothers In Arms",
    title: "Money For Nothing",
    artist: "Dire Straits",
    duration: "8:26",
    src: "music/Money For Nothing (Remastered 1996).mp3",
    img: "album-cover/brothersinarms.jpg",
  },
  {
    id: 2,
    album: "On Every Street",
    title: "Planet Of The New Orleans",
    artist: "Dire Straits",
    duration: "7:45",
    src: "music/Planet Of New Orleans.mp3",
    img: "album-cover/oneverystreet.jpg",
  },
];

const storedSongs = JSON.parse(localStorage.getItem("songs"));

const userData = {
  songs: storedSongs?.length ? storedSongs : [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const audio = new Audio();

const renderSongs = (array) => {
  const songsHTML = array
    .map((song) => {
      return `
        <li class="song-item" data-id="${song.id}" onclick="playSong(${song.id})">
        <img class="song-img" src="${song.img}" alt="${song.title}">
        <h2 class="play-button"><i class="fa-solid fa-play"></i></h2>
        <div class="song-info">
          <p class="song-title">${song.title}</p>
          <p class="song-artist">${song.artist}</p>
        </div>
      </li>
        `;
    })
    .join("");

  playlistSongs.innerHTML = songsHTML;
};

const setSongsList = (arr = userData?.songs) => {
  if (arr.length === 0) {
    playlistSongs.innerHTML = "<p>Trenutno nema podataka o trazenoj pesmi.</p>";
    return;
  }
  playlistSongs.innerHTML = arr
    .map(({ id, title, artist, duration, img }) => {
      return `
          <li class="song-item" data-id="${id}" onclick="playSong(${id})">
          <img class="song-img" src="${img}" alt="${title}">
          <h2 class="play-button"><i class="fa-solid fa-play"></i></h2>
          <div class="song-info" onclick="playSong(${id})">
            <p class="song-title">${title}</p>
            <p class="song-artist">${artist}</p>
          </div>
        </li>
          `;
    })
    .join("");
};

const updateDisplaySong = () => {
  const song = userData?.currentSong;

  if (!song) return;

  nowPlayDiv.innerHTML = `
      <div class="now-playing-info">
        <img src="${song.img}" alt="${song.title}" class="now-playing-img">
        <div>
          <p class="now-playing-title">${song.title}</p>
          <p class="now-playing-artist">${song.artist}</p>
          <progress class="now-playing-duration" value="0" max="0"></progress>
          <span class="duration-label">${song.duration}</span>
        </div>
      </div>
    `;
};

const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }

  userData.currentSong = song;
  audio.play();
  updateDisplaySong();
  formContainer.classList.add("hidden");
  openFormBtn.style.display = "none";
  document.querySelector(".container").style.display = "flex";
  updatePrevButtonVisibility();
  updateNextButtonVisibility();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  audio.pause();
};

const togglePlayPause = () => {
  if(!userData.currentSong) return;

  if (audio.paused) {
    audio.play();
    playButton.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  } else {
    pauseSong();
    playButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
  }
};

const nextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const next = userData?.songs[currentSongIndex + 1];

    playSong(next.id);
  }
};

const prevSong = () => {
  if (userData?.currentSong === null) return;

  const currentSongIndex = getCurrentSongIndex();
  const prev = userData?.songs[currentSongIndex - 1];

  playSong(prev.id);
};

const shuffleSong = () => {
  const shuffleIdSong = Math.floor(Math.random() * userData.songs.length);
  playSong(userData.songs[shuffleIdSong].id);
};

const getCurrentSongIndex = () =>
  userData?.songs.indexOf(userData?.currentSong);

const updateProgressBar = () => {
  const progress = document.querySelector(".now-playing-duration");
  progress.value = audio.currentTime;
};

const updatePrevButtonVisibility = () => {
  const currentIndex = getCurrentSongIndex();
  prevButton.style.display = currentIndex === 0 ? "none" : "inline-block";
};

const updateNextButtonVisibility = () => {
  const currentIndex = getCurrentSongIndex();
  const lastIndex = userData.songs.length - 1;

  nextButton.style.display =
    currentIndex === lastIndex ? "none" : "inline-block";
};

const addNewSong = (e) => {
  e.preventDefault();

  const newSong = {
    id: userData.songs.length,
    album: albumSong.value,
    title: titleSong.value,
    artist: artistSong.value,
    duration: durationSong.value,
    src: srcSong.value,
    img: imgSong.value,
  };

  userData.songs.push(newSong);
  localStorage.setItem("songs", JSON.stringify(userData.songs));
  renderSongs(userData.songs);

  // Očisti formu
  addSongForm.reset();

  // Sakrij formu i prikaži dugme za otvaranje forme i playlistu
  formContainer.classList.add("hidden");
  openFormBtn.style.display = "inline-block";
  playlistSongs.classList.remove("hidden-playlist");
};

renderSongs(userData.songs);
playButton.addEventListener("click", togglePlayPause);
audio.addEventListener("ended", nextSong);
audio.addEventListener("timeupdate", updateProgressBar);
audio.addEventListener("loadedmetadata", () => {
  const progress = document.querySelector(".now-playing-duration");
  progress.max = audio.duration;
});
searchInputSong.addEventListener("input", (e) => {
  const searchInputTerm = e.target.value.toLowerCase();

  if (searchInputTerm === "") {
    renderSongs(userData.songs);
    return;
  }

  setSongsList(
    userData?.songs.filter(
      (song) =>
        song.artist.toLowerCase().includes(searchInputTerm) ||
        song.title.toLowerCase().includes(searchInputTerm) ||
        song.album.toLowerCase().includes(searchInputTerm)
    )
  );
});
sortSongsDropdownList.addEventListener("change", (e) => {
  playlistSongs.innerHTML = "";

  switch (e.target.value) {
    case "all":
      setSongsList();
      break;

    case "dire-straits-all-songs":
      setSongsList(
        userData?.songs.filter((song) => song.artist === "Dire Straits")
      );
      break;

    case "brothers-in-arms":
      setSongsList(
        userData?.songs.filter((song) => song.album === "Brothers In Arms")
      );
      break;

    case "on-every-street":
      setSongsList(
        userData?.songs.filter((song) => song.album === "On Every Street")
      );
      break;

    case "ploho-all-songs":
      setSongsList(userData?.songs.filter((song) => song.artist === "Ploho"));
      break;

    default:
      playlistSongs.innerHTML = `<p>Trenutno ne postoji zeljeni album/izvodjac.</p>`;
  }
});
nextButton.addEventListener("click", nextSong);
prevButton.addEventListener("click", prevSong);
shuffleButton.addEventListener("click", shuffleSong);
openFormBtn.addEventListener("click", () => {
  formContainer.classList.toggle("hidden");
  playlistSongs.classList.toggle("hidden-playlist");
});
addSongForm.addEventListener("submit", addNewSong);
