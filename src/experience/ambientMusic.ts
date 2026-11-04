let soundtrack: HTMLAudioElement | null = null;
let enabled = false;

function getSoundtrack() {
  if (!soundtrack) {
    soundtrack = new Audio("/audio/bgmusic.mp3");
    soundtrack.loop = true;
    soundtrack.preload = "none";
    soundtrack.volume = 0.68;
  }
  return soundtrack;
}

export function startAmbientMusic() {
  if (!enabled) return;
  void getSoundtrack().play().catch((error: unknown) => {
    // Browsers may still refuse playback; the visitor can retry with Sound.
    console.warn("Ambient soundtrack could not start.", error);
  });
}

export function setAmbientMusicEnabled(value: boolean) {
  enabled = value;
  if (value) {
    startAmbientMusic();
    return;
  }
  soundtrack?.pause();
}

export function isAmbientMusicEnabled() {
  return enabled;
}
