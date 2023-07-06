// List of use cases for
/**
 * 1. Render songs ==>OK
 * 2. Scroll top==>OK
 * 3. Play/ pause / seek ==>OK
 * 4. CD rotation==>OK
 * 5. Next / prev==>OK
 * 6. Random==>OK
 * 7. Next / Repeat when end==>OK
 * 8. Active Song
 * 9. Scroll active song into view
 * 10.play song when click
 */
//
// map

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "Luan's Player";

const playlist = $(".playlist");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const progress = $("#progress");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  // set các option để lần sau vào thì vẫn còn option đó
  config: JSON.parse(localStorage.getItem("PLAYER_STORAGE_KEY")) || {},
  songs: [
    {
      name: "OMG",
      singer: "Newjeans",
      path: "./song/NewJeans_-_OMG.mp3",
      image: "./img/OMG.jpg",
    },
    {
      name: "Players",
      singer: "Coi Leray",
      path: "./song/Coi_Leray_-_Players.mp3",
      image: "./img/players.jpg",
    },
    {
      name: "Wish you were sober",
      singer: "Conan Gray",
      path: "./song/Conan_Gray_-_Wish_You_Were_Sober.mp3",
      image: "./img/WUWS.jpg",
    },
    {
      name: "Happy Fools",
      singer: "TXT , Coi Leray",
      path: "./song/TOMORROW_X_TOGETHER_feat_Coi_Leray_-_Happy_Fools.mp3",
      image: "./img/fools.jpg",
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Damn",
      singer: "Raftaar x kr$na",
      path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:
        "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg",
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  //load the list song
  render: function () {
    const htmls = this.songs.map((current, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div
                    class="thumb"
                    style="
                    background-image: url('${current.image}');
                    "
                ></div>
                <div class="body">
                    <h3 class="title">${current.name}</h3>
                    <p class="author">${current.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
    });
    playlist.innerHTML = htmls.join("\n");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    _this = this;

    const cdWidth = cd.offsetWidth;

    //xử lý cd quay / dừng
    const cdThumbRotate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 sec
      iterations: Infinity, //
    });
    cdThumbRotate.pause();

    // kéo lên thì ẩn cái đĩa
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // play song
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbRotate.play();
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbRotate.pause();
    };
    // keep track of the current time
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPrecent = (audio.currentTime / audio.duration) * 100;
        progress.value = Math.floor(progressPrecent);
      }
    };
    // tua bai
    progress.onchange = function (e) {
      const newTime = Math.floor((audio.duration / 100) * e.target.value);
      audio.currentTime = newTime;
    };

    // turn to next song
    nextBtn.onclick = function () {
      var newRandomIndex = 0;
      if (_this.isRandom) {
        do {
          newRandomIndex = Math.floor(Math.random() * _this.songs.length);
        } while (newRandomIndex === _this.currentIndex);
        _this.currentIndex = newRandomIndex;
        _this.loadCurrentSong();
      } else if (_this.isRepeat) {
        _this.currentIndex = _this.currentIndex;
        _this.loadCurrentSong();
      } else {
        _this.currentIndex++;
        if (_this.currentIndex >= _this.songs.length) {
          _this.currentIndex = 0;
          _this.loadCurrentSong();
        } else {
          _this.loadCurrentSong();
        }
      }
      playBtn.click();
    };
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        do {
          const newRandomIndex = Math.floor(Math.random() * _this.songs.length);
        } while (newRandomIndex === _this.currentIndex);
        _this.currentIndex = newRandomIndex;
        _this.loadCurrentSong();
      } else if (_this.isRepeat) {
        const repeatIndex = _this.currentIndex;
        _this.currentIndex = repeatIndex;
        _this.loadCurrentSong();
      } else {
        _this.currentIndex--;
        if (_this.currentIndex < 0) {
          _this.currentIndex = 0;
          _this.loadCurrentSong();
        } else {
          _this.loadCurrentSong();
        }
      }
      playBtn.click();
    };
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      this.classList.toggle("active", _this.isRandom);
    };
    audio.onended = function () {
      nextBtn.click();
    };
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      this.classList.toggle("active", _this.isRepeat);
    };

    // lắng nghe hành vi bấm vào playlists
    playlist.onclick = function (e) {
      const songTarget = e.target.closest(".song:not(.active)");
      if (songTarget || e.target.closest(".option")) {
        // xử lý khi click vào song
        if (songTarget) {
          _this.currentIndex = Number(songTarget.getAttribute("data-index"));
          _this.loadCurrentSong();
          playBtn.click();
        }
        // xử lý khi click vào song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function (e) {
    setTimeout(function () {
      $(".song.active").scrollIntoView(false);
    }, 300);
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  loadCurrentSong: function () {
    const heading = $("header h2");
    const cdThumb = $(".cd-thumb");
    const audio = $("#audio");
    this.isPlaying = false;

    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    this.render();
    this.scrollToActiveSong();
  },

  // Khởi tạo chụng để chạy chương trình cho dễ
  start: function () {
    // load configuration từ local storage
    this.loadConfig();
    // định nghĩa các thuốc tính cho object
    this.defineProperties();
    // Lắng nghe xử lý sự kiện trong app

    this.handleEvents();

    //load current song on the dashboard
    this.loadCurrentSong();

    // load list songs
    this.render();
    // hiển thị trạng thái ban đầu của butoon repeat & random
    randomBtn.classList.toggle("active", _this.isRandom);
    repeatBtn.classList.toggle("active", _this.isRepeat);
  },
};
app.start();
// xử lý
