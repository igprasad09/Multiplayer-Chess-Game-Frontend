 function playSound(soundName) {
      const audio = new Audio(`/sounds/${soundName}.mp3`);

      audio.play().catch((err) => {
        console.log("Sound playback failed:", err);
          });
        }
export default playSound;