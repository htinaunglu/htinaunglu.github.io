const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_!@#$%^&*";
const KATAKANA = 'アカサタナハマヤラワンイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロ';
const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const MYANMAR = 'ကခဂဃငစဆဇဈညဋဌဍဏတထဒဓနပဖဗဘမယရလဝသဟဠအ၀၁၂၃၄၅၆၇၈၉၀';
const BURMESE_NUM = '၀၁၂၃၄၅၆၇၈၉၀';
const MATRIX_CHARS = MYANMAR ;

function animateHeader(id, text) {
  const el = document.getElementById(`header-${id}`);
  let frame = 0;
  const interval = setInterval(() => {
    let output = "";
    for (let i = 0; i < text.length; i++) {
      output += i < frame ? text[i] : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    }
    el.textContent = output;
    frame++;
    if (frame > text.length) clearInterval(interval);
  }, 75);
}

function typeCommand(id, command, callback) {
  const el = document.getElementById(`cmd-${id}`);
  let i = 0;
  const prefix = '<span class="cmd-prefix">root@gracemainland:~# </span>';
  el.innerHTML = prefix;
  const interval = setInterval(() => {
    el.innerHTML = prefix + command.slice(0, i);
    i++;
    if (i > command.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 100);
}

function showTerminalLinesSequentially(id) {
  const lines = document.querySelectorAll(`#${id} .terminal-line`);
  let index = 0;
  function showNextLine() {
    if (index < lines.length) {
      lines[index].style.visibility = 'visible';
      index++;
      setTimeout(showNextLine, 100);
    }
  }
  showNextLine();
}

function showSection(id, headerText, command) {
  // Remove active class from all nav links
  document.querySelectorAll('nav a.active').forEach(link => link.classList.remove('active'));
  // Add active class to the clicked nav link
  const matchingLink = document.querySelector(`nav a[data-section="${id}"]`);
  if (matchingLink) matchingLink.classList.add('active');
  // Hide all sections and terminal lines
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.terminal-line').forEach(el => el.style.visibility = 'hidden');
  // Show target section
  document.getElementById(id).classList.add('active');
  // Animate header & command
  animateHeader(id, headerText);
  typeCommand(id, command, () => showTerminalLinesSequentially(id));
}

document.addEventListener("DOMContentLoaded", () => {
  showSection('about', '> WHOAMI', 'whoami');
});

// Matrix effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
let fontSize = 16;
let drops = [];

function resizeMatrixCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  drops = Array(columns).fill(1);
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#33ff77';
  ctx.font = fontSize + 'px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

window.addEventListener('resize', resizeMatrixCanvas);
resizeMatrixCanvas();
setInterval(drawMatrix, 33);
