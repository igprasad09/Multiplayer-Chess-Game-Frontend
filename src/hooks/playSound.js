const audioCache = {};

function getAudio(soundName) {
  if (!audioCache[soundName]) {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    if (soundName === "win") audio.loop = true;
    audioCache[soundName] = audio;
  }
  return audioCache[soundName];
}

function playSound(soundName, stopPlay) {
  const audio = getAudio(soundName);

  if (stopPlay) {
    audio.pause();
    audio.currentTime = 0;
    return;
  }

  audio.currentTime = 0;
  audio.play().catch((err) => {
    if (err.name !== "AbortError") {
      console.log("Sound playback failed:", err);
    }
  });
}

export default playSound;
