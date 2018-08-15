
function getFromStorage(name, defaultValue) {
  const value = window.localStorage.getItem(name);
  if (value === null) {
    window.localStorage.setItem(name, defaultValue);
    return defaultValue;
  }
  return value;
}

let volume = getFromStorage("volume", 1.0);
let muted = getFromStorage("muted", false);
let ambient = audio("sounds/background.mp3", { loop: true });

function audio(src, options = {}) {
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

function isButton(element) {
  return /item|menuItem/.test(element.className);
}

function handleMouseEnter(e) {
  if (isButton(e.target)) {
    const over = audio("sounds/over.mp3");
    over.play();
  }
}

function handleVisibility(e) {
  if (ambient) {
    if (!document.hidden) {
      ambient.play();
    } else {
      ambient.pause();
    }
  }
}

function mute() {
  muted = true;
  window.localStorage.setItem("muted", muted);
}

function unmute() {
  muted = false;
  window.localStorage.setItem("muted", muted);
}

export function toggle() {
  if (muted) {
    unmute();
  } else {
    mute();
  }
}

export function start() {

  if (!ambient) {
    ambient = audio("sounds/background.mp3", { loop: true });
  }
  ambient.muted = muted;
  ambient.volume = volume;
  ambient.play();

  document.addEventListener("visibilitychange", handleVisibility);
  document.addEventListener("mouseenter", handleMouseEnter, true);

}

export function stop() {

  if (ambient) {
    ambient.pause();
  }

  document.removeEventListener("visibilitychange", handleVisibility);
  document.removeEventListener("mouseenter", handleMouseEnter);

}

export default {
  get isOn() {
    return !muted;
  },
  start,
  stop,
  toggle
};
