export function initSounds() {

  document.addEventListener("visibilitychange", (e) => {

    if (document.visibilityState === "visible") {
      ambient.play();
    } else {
      ambient.pause();
    }

  });

  const ambient = document.createElement("audio");
  ambient.src = "sounds/background.mp3";
  ambient.loop = true;
  ambient.play();

  let volume = 1.0;
  return {
    set volume(value) {
      ambient.volume = volume = value;
    },
    get volume() {
      return volume;
    }
  };

}
