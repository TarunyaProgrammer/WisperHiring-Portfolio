let context: AudioContext | null = null;
let master: GainNode | null = null;
let noteTimer: number | null = null;
let noteIndex = 0;
let enabled = false;

const melody = [293.66, 440, 329.63, 523.25, 392, 329.63, 587.33, 440];

function createImpulse(audio: AudioContext) {
  const length = audio.sampleRate * 3.2;
  const impulse = audio.createBuffer(2, length, audio.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const samples = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const fade = (1 - i / length) ** 3.2;
      samples[i] = (Math.random() * 2 - 1) * fade * 0.28;
    }
  }
  return impulse;
}

function pluck(audio: AudioContext, frequency: number, destination: AudioNode) {
  const now = audio.currentTime;
  const voice = audio.createGain();
  const filter = audio.createBiquadFilter();
  const reverb = audio.createConvolver();
  const wet = audio.createGain();
  reverb.buffer = createImpulse(audio);
  filter.type = "lowpass";
  filter.frequency.value = 1900;
  voice.gain.setValueAtTime(0.0001, now);
  voice.gain.exponentialRampToValueAtTime(0.1, now + 0.12);
  voice.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
  wet.gain.value = 0.48;
  filter.connect(voice);
  voice.connect(destination);
  voice.connect(reverb);
  reverb.connect(wet);
  wet.connect(destination);

  const fundamental = audio.createOscillator();
  const overtone = audio.createOscillator();
  fundamental.type = "sine";
  fundamental.frequency.value = frequency;
  overtone.type = "triangle";
  overtone.frequency.value = frequency * 2.002;
  const overtoneLevel = audio.createGain();
  overtoneLevel.gain.value = 0.11;
  fundamental.connect(filter);
  overtone.connect(overtoneLevel);
  overtoneLevel.connect(filter);
  fundamental.start(now);
  overtone.start(now);
  fundamental.stop(now + 5);
  overtone.stop(now + 5);
  fundamental.onended = () => {
    fundamental.disconnect();
    overtone.disconnect();
    overtoneLevel.disconnect();
    filter.disconnect();
    voice.disconnect();
    reverb.disconnect();
    wet.disconnect();
  };
}

function buildScore(audio: AudioContext) {
  const output = audio.createGain();
  const lowpass = audio.createBiquadFilter();
  const reverb = audio.createConvolver();
  const wet = audio.createGain();
  master = audio.createGain();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 780;
  master.gain.value = 0;
  wet.gain.value = 0.48;
  reverb.buffer = createImpulse(audio);
  output.connect(lowpass);
  lowpass.connect(master);
  lowpass.connect(reverb);
  reverb.connect(wet);
  wet.connect(master);
  master.connect(audio.destination);

  // A slow D minor color bed gives the corridor a low, steady harmonic floor.
  for (const [frequency, level] of [[73.42, 0.11], [110, 0.065], [146.83, 0.045], [174.61, 0.032]]) {
    const oscillator = audio.createOscillator();
    const voice = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    voice.gain.value = level;
    oscillator.connect(voice);
    voice.connect(output);
    oscillator.start();
  }
  return output;
}

function scheduleNextNote() {
  if (!context || !master || !enabled) return;
  pluck(context, melody[noteIndex % melody.length], master);
  noteIndex += 1;
}

export function startAmbientMusic() {
  if (!enabled) return;
  if (!context) {
    context = new AudioContext();
    buildScore(context);
  }
  void context.resume();
  master?.gain.setTargetAtTime(0.12, context.currentTime, 1.1);
  if (noteTimer === null) {
    scheduleNextNote();
    noteTimer = window.setInterval(scheduleNextNote, 2600);
  }
}

export function setAmbientMusicEnabled(value: boolean) {
  enabled = value;
  if (!context || !master) {
    if (value) startAmbientMusic();
    return;
  }
  if (value) {
    startAmbientMusic();
    return;
  }
  master.gain.setTargetAtTime(0, context.currentTime, 0.18);
  if (noteTimer !== null) {
    window.clearInterval(noteTimer);
    noteTimer = null;
  }
  window.setTimeout(() => {
    if (!enabled && context?.state === "running") void context.suspend();
  }, 700);
}

export function isAmbientMusicEnabled() {
  return enabled;
}
