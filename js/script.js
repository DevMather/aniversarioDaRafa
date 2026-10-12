// ==========================================
// Core de Responsividade (View Layer Fix)
// ==========================================
const calculateVh = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};
window.addEventListener("resize", calculateVh);
calculateVh(); 

// ==========================================
// Mapeamento de DOM (Escopo Global)
// ==========================================
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const welcomeScreen = document.getElementById("welcome-screen");
const giftScreen = document.getElementById("gift-screen");
const btnMusicToggle = document.getElementById("btn-music-toggle");
const messageContainer = document.getElementById("message-container");

// Novo Node mapeado da View
const surpriseMeme = document.getElementById("surprise-meme");

const bgMusic = new Audio("assets/backAudio.mp3");
bgMusic.loop = true;

// ==========================================
// State Management
// ==========================================
const noPhrases = [
  "Tem certeza?",
  "Clica logo em sim menina!",
  "Vai tentar fugir?",
  "É sério, clica no Sim!",
  "Não aceito não como resposta.",
];

const birthdayMessage = `Oi RAFAAAAAA!\n
\n Eu queria te desejar um feliz aniversário de um jeito diferente,
 porque mesmo que eu não possa te dar um presente de vdd,
 acho que vc merece ao menos um feliz aniversario diferente ne?\n
\n Quero que vc saiba que é uma pessoa incrível e muito importante,
 que vc nunca se esqueça disso em!\n
\n Espero que essa data se repita por muitos anos,
 que vc continue sendo essa menina inteligente e sabida. 
\n Aproveita muito o seu dia!`;

let clickCount = 0;
let isPlaying = false;
let isTyping = false;
let isAudioFading = false; 

// ==========================================
// Utilitários Assíncronos (Promises)
// ==========================================
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function typeWriter(text, element, speedMs = 40) {
  if (isTyping) return;
  isTyping = true;

  element.innerHTML = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === "\n") {
      element.innerHTML += "<br>";
    } else {
      element.innerHTML += text.charAt(i);
    }
    await sleep(speedMs);
  }
  isTyping = false;
}

async function fadeInAudio(audioElement, durationMs = 2000) {
  if (isAudioFading) return;
  isAudioFading = true;

  audioElement.volume = 0;
  audioElement
    .play()
    .catch((err) => console.error("Autoplay bloqueado: ", err));

  const steps = 20;
  const stepTime = durationMs / steps;
  const volumeIncrement = 1 / steps;

  for (let i = 1; i <= steps; i++) {
    await sleep(stepTime);
    audioElement.volume = Math.min(volumeIncrement * i, 1.0);
  }

  isAudioFading = false;
}

// ==========================================
// Controllers (Event Listeners)
// ==========================================
btnNo.addEventListener("click", () => {
  btnNo.innerText = noPhrases[clickCount];
  clickCount = Math.min(clickCount + 1, noPhrases.length - 1);
  const scaleFactor = 1 + clickCount * 0.15;
  btnYes.style.transform = `scale(${scaleFactor})`;
  btnYes.style.transition = "transform 0.2s ease";
});

btnYes.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  welcomeScreen.classList.remove("active");

  giftScreen.classList.remove("hidden");

  // Transformamos a callback em assíncrona
  setTimeout(async () => {
    giftScreen.classList.add("active");
    
    // O await segura a Thread lógica (sem travar a UI) até o TypeWriter devolver a Promise resolvida
    await typeWriter(birthdayMessage, messageContainer, 40);
    
    // A mutação do DOM só ocorre quando o TypeWriter terminar
    surpriseMeme.classList.remove("hidden");
  }, 50);
});

btnMusicToggle.addEventListener("click", () => {
  if (isAudioFading) return;

  if (isPlaying) {
    bgMusic.pause();
    btnMusicToggle.innerHTML = '<span id="music-icon">🎵</span> Tocar Música';
  } else {
    fadeInAudio(bgMusic, 2000);
    btnMusicToggle.innerHTML = '<span id="music-icon">⏸️</span> Pausar Música';
  }

  isPlaying = !isPlaying;
});