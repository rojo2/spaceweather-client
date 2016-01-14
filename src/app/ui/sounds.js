export function initSounds() {

  let volume = window.localStorage.getItem("volume") || 1.0,
      muted = window.localStorage.getItem("muted") || false;

  const ambient = sound("sounds/background.mp3", { loop: true });
  ambient.muted = muted;
  ambient.volume = volume;
  ambient.play();

  function sound(src, options = {}) {
    options = Object.assign({
      volume: volume,
      loop: false,
      muted: muted
    }, options);

    const element = document.createElement("audio");
    element.src = src;
    element.muted = options.muted;
    element.volume = options.volume;
    element.loop = options.loop;
    return element;
  }

  function handleMouseEnter(e) {
    const over = sound("sounds/over.mp3");
    over.play();
  }

  function updateSoundButton() {
    const button = document.querySelector(".Button--sound");
    if (muted) {
      button.className = "Button--sound isOff";
    } else {
      button.className = "Button--sound isOn";
    }
  }

  function updateAmbient() {
    ambient.muted = muted;
    ambient.volume = volume;
  }

  const button = document.querySelector(".Button--sound");
  button.addEventListener("click", (e) => {

    muted = !muted;

    updateSoundButton(muted);
    updateAmbient(muted);

    window.localStorage.setItem("muted", muted);
    window.localStorage.setItem("volume", volume);

  });

  updateSoundButton();

  document.addEventListener("visibilitychange", (e) => {
    if (document.visibilityState === "visible") {
      ambient.play();
    } else {
      ambient.pause();
    }
  });

  Array.prototype.slice.call(document.querySelectorAll("[class*=item], [class*=menuItem]")).map((el) => {
    el.addEventListener("mouseenter", handleMouseEnter, false);
    return el;
  });

  return {
    set muted(value) {
      muted = value;
    },
    get muted() {
      return muted;
    },
    set volume(value) {
      ambient.volume = volume = value;
    },
    get volume() {
      return volume;
    }
  };

}
