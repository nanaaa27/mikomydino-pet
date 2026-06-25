// ==========================================================================
// 1. DEKLARASI ELEMEN HTML (Tetap sesuai struktur dasar kamu)
// ==========================================================================
const energyFill = document.getElementById('energyFill');
const energyText = document.getElementById('energyText');
const happyFill = document.getElementById('happyFill');
const happyText = document.getElementById('happyText');

const petAvatar = document.getElementById('petAvatar');
const petExpression = document.getElementById('petExpression');
const petStatusText = document.getElementById('petStatusText');
const petAura = document.getElementById('petAura');
const petDisplayBox = document.querySelector('.pet-display-box');

const btnFeed = document.getElementById('btnFeed');
const feedLimitText = document.getElementById('feedLimitText');
const btnPlay = document.getElementById('btnPlay');
const btnSleep = document.getElementById('btnSleep');
const btnHeal = document.getElementById('btnHeal');

const coinText = document.getElementById('coinText');
const btnBuyIceCream = document.getElementById('btnBuyIceCream');
const shopSection = document.getElementById('shopSection');

const levelText = document.getElementById('levelText');
const xpText = document.getElementById('xpText');
const xpFill = document.getElementById('xpFill');

const petNameDisplay = document.getElementById('petNameDisplay');
const nameInputWrapper = document.getElementById('nameInputWrapper');
const inputPetName = document.getElementById('inputPetName');
const btnSaveName = document.getElementById('btnSaveName');

const miniGameBox = document.getElementById('miniGameBox');
const mainPetDisplay = document.getElementById('mainPetDisplay');
const mainStatusSection = document.getElementById('mainStatusSection');
const mainActionSection = document.getElementById('mainActionSection');
const gameDino = document.getElementById('gameDino');
const gameObstacle = document.getElementById('gameObstacle');
const miniGameScore = document.getElementById('miniGameScore');

// ==========================================================================
// 2. VARIABEL STATUS UTAMA
// ==========================================================================
let energy = 100;
let happiness = 100;
let coins = 0;
let isAlive = true;
let level = 1;
let xp = 0;
let xpNeeded = 100;
let isSleeping = false;

let freeFeedCount = 3; 
let isMiniGamePlaying = false;
let score = 0;

// Variabel Kontrol Engine Game Baru (Menggantikan setInterval lambat)
let gameAnimationId; 
let hasPassedObstacle = false; // Mencegah exploitasi skor ganda

// ==========================================================================
// 3. FUNGSI UPDATE UI UTAMA
// ==========================================================================
function updateUI() {
  energyFill.style.width = energy + '%';
  energyText.textContent = energy + '%';
  happyFill.style.width = happiness + '%';
  happyText.textContent = happiness + '%';
  coinText.textContent = coins;

  levelText.textContent = `⭐ Level ${level}`;
  xpText.textContent = `${xp} / ${xpNeeded} XP`;
  const xpPercentage = (xp / xpNeeded) * 100;
  xpFill.style.width = xpPercentage + '%';
  
  feedLimitText.textContent = `${freeFeedCount}/3`;

  if (!isAlive || isMiniGamePlaying) return;

  if (isSleeping) {
    petAvatar.textContent = '💤';
    petExpression.textContent = '(＿ ＿).｡oO';
    petStatusText.textContent = 'Kondisi: Tidur Nyenyak 😴';
    petStatusText.style.backgroundColor = '#2b3252';
    petStatusText.style.color = '#ffffff';
  } else {
    if (energy <= 0 || happiness <= 0) {
      isAlive = false;
      petAvatar.textContent = '💀';
      petExpression.textContent = '(✖╭╮✖)';
      petStatusText.textContent = 'Kondisi: Pingsan 😢';
      petStatusText.style.backgroundColor = '#fcdede';
      petStatusText.style.color = '#c94a4a';
      
      btnFeed.style.display = 'none';
      btnPlay.style.display = 'none';
      btnSleep.style.display = 'none';
      shopSection.style.display = 'none';
      btnHeal.style.display = 'flex';
    } else if (energy <= 30 || happiness <= 30) {
      petAvatar.textContent = '🦕';
      petExpression.textContent = '(ಥ﹏ಥ)';
      petStatusText.textContent = 'Kondisi: Sekarat! 🚨';
      petStatusText.style.backgroundColor = '#fffbeb';
      petStatusText.style.color = '#b78103';
    } else {
      petAvatar.textContent = '🦕';
      petExpression.textContent = '(◕‿◕)';
      petStatusText.textContent = 'Kondisi: Bahagia 🌿';
      petStatusText.style.backgroundColor = 'var(--matcha-light)';
      petStatusText.style.color = 'var(--matcha-medium)';
    }
  }
}

// ==========================================================================
// 4. LOGIKA BATASAN MAKAN GRATIS (REAL TIME 24 JAM)
// ==========================================================================
function loadFeedLimit() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem('lastFeedDate');
  const savedCount = localStorage.getItem('freeFeedCount');

  if (savedDate !== today) {
    freeFeedCount = 3;
    localStorage.setItem('lastFeedDate', today);
    localStorage.setItem('freeFeedCount', freeFeedCount);
  } else if (savedCount !== null) {
    freeFeedCount = parseInt(savedCount);
  }
}

// ==========================================================================
// 5. EVENT BUTTON MAKAN, TOKO, DAN TIDUR
// ==========================================================================
btnFeed.addEventListener('click', () => {
  if (!isAlive || isSleeping) return;
  loadFeedLimit();

  if (freeFeedCount > 0) {
    freeFeedCount--;
    localStorage.setItem('freeFeedCount', freeFeedCount);

    energy = Math.min(100, energy + 10);
    triggerPopAnimation();
    gainXP(15);
    updateUI();
  } else {
    alert("❌ Jatah makan gratis hari ini habis (Maks 3x)! Yuk main mini-game buat dapet koin terus beli es krim di toko premium!");
  }
});

btnBuyIceCream.addEventListener('click', () => {
  if (!isAlive || isSleeping) return;
  if (coins >= 30) {
    coins -= 30;
    energy = Math.min(100, energy + 40);
    triggerPopAnimation();
    gainXP(50);
    updateUI();
  } else {
    alert("❌ Koin kurang! Main mini game dulu yuk.");
  }
});

btnSleep.addEventListener('click', () => {
  if (!isAlive) return;

  isSleeping = !isSleeping;
  document.body.classList.toggle('dark-theme');

  if (isSleeping) {
    petDisplayBox.classList.add('night-mode');
    btnSleep.classList.add('active-sleep');
    btnSleep.innerHTML = '<span class="icon">💡</span> Nyalakan Lampu (Bangun)';
    
    btnFeed.style.opacity = '0.5';
    btnPlay.style.opacity = '0.5';
    shopSection.style.opacity = '0.5';
  } else {
    petDisplayBox.classList.remove('night-mode');
    btnSleep.classList.remove('active-sleep');
    btnSleep.innerHTML = '<span class="icon">💡</span> Matikan Lampu (Tidur)';
    
    btnFeed.style.opacity = '1';
    btnPlay.style.opacity = '1';
    shopSection.style.opacity = '1';
  }
  updateUI();
});

// ==========================================================================
// 6. MODUL MINI-GAME: DINO JUMP INTERAKTIF (HIGH PERFORMANCE OPTIMIZED)
// ==========================================================================
btnPlay.addEventListener('click', () => {
  if (!isAlive || isSleeping) return;
  
  isMiniGamePlaying = true;
  mainPetDisplay.style.display = 'none';
  mainStatusSection.style.display = 'none';
  shopSection.style.display = 'none';
  btnSleep.style.display = 'none';
  btnFeed.style.display = 'none';
  btnPlay.style.display = 'none';
  
  miniGameBox.style.display = 'flex';
  
  score = 0;
  miniGameScore.textContent = `Skor: ${score}`;
  hasPassedObstacle = false;
  
  // Memicu animasi CSS rintangan berjalan
  gameObstacle.classList.add('obstacle-move');
  
  // Jalankan Game Loop berkecepatan tinggi (60 FPS)
  gameAnimationId = requestAnimationFrame(miniGameLoop);
});

// Deteksi klik layar untuk melompat
miniGameBox.addEventListener('click', () => {
  if (!gameDino.classList.contains('dino-jump-animation')) {
    gameDino.classList.add('dino-jump-animation');
    setTimeout(() => {
      gameDino.classList.remove('dino-jump-animation');
    }, 500);
  }
});

// --- RAHASIA ENGINE 60 FPS: Menggunakan RequestAnimationFrame ---
function miniGameLoop() {
  if (!isMiniGamePlaying) return;

  // 1. Ambil koordinat pixel real-time di layar browser
  const dinoBottom = parseInt(window.getComputedStyle(gameDino).getPropertyValue("bottom"));
  const obstacleLeft = parseInt(window.getComputedStyle(gameObstacle).getPropertyValue("left"));

  // 2. LOGIKA TABRAKAN PRESISI (Hitung bounding box area tabrakan)
  // Dino berada di sebelah kiri (left sekitar 20px - 60px)
  if (obstacleLeft > 20 && obstacleLeft < 60 && dinoBottom <= 25) {
    endMiniGame();
    return; // Hentikan loop seketika jika terjadi tabrakan
  }

  // 3. LOGIKA SKOR VALID (Skor bertambah jika rintangan sukses melewati X milik Dino)
  if (obstacleLeft < 20 && !hasPassedObstacle) {
    score += 10;
    miniGameScore.textContent = `Skor: ${score}`;
    hasPassedObstacle = true; // Tandai rintangan ini sudah dihitung skornya
  }

  // Reset status tanda lolos ketika rintangan muncul kembali dari kanan (X > 200)
  if (obstacleLeft > 200) {
    hasPassedObstacle = false;
  }

  // Teruskan loop ke frame berikutnya
  gameAnimationId = requestAnimationFrame(miniGameLoop);
}

function endMiniGame() {
  // Matikan engine loop dan copot kelas animasi CSS
  cancelAnimationFrame(gameAnimationId);
  gameObstacle.classList.remove('obstacle-move');
  
  // Amankan data reward hasil game
  coins += score;
  happiness = Math.min(100, happiness + 20); 
  gainXP(score); 

  alert(`💥 Nabrak! Game Over.\nKamu berhasil mengumpulkan ${score} 🪙 Koin.`);
  
  isMiniGamePlaying = false;
  miniGameBox.style.display = 'none';
  
  mainPetDisplay.style.display = 'flex';
  mainStatusSection.style.display = 'flex';
  shopSection.style.display = 'block';
  btnSleep.style.display = 'flex';
  btnFeed.style.display = 'flex';
  btnPlay.style.display = 'flex';
  
  updateUI();
}

// ==========================================================================
// 7. FUNGSI UTILITAS TAMBAHAN
// ==========================================================================
function gainXP(amount) {
  if (amount <= 0) return;
  xp += amount;
  if (xp >= xpNeeded) {
    level += 1;
    xp = xp - xpNeeded;
    xpNeeded = Math.round(xpNeeded * 1.5);
    alert(`🎉 LEVEL UP! Miko naik ke Level ${level}! 🌱✨`);
  }
  updateUI();
}

function triggerPopAnimation() {
  petAvatar.classList.add('animate-pop');
  setTimeout(() => { petAvatar.classList.remove('animate-pop'); }, 400);
}

// Pengurangan berkala yang aman
const gameClock = setInterval(() => {
  if (isAlive && !isSleeping && !isMiniGamePlaying) {
    energy = Math.max(0, energy - 5);
    happiness = Math.max(0, happiness - 8);
    updateUI();
  }
}, 10000);

function checkPetName() {
  const savedName = localStorage.getItem('mikoPetName');
  if (savedName) {
    petNameDisplay.innerHTML = `<span class="font-serif">${savedName}</span> 🌱`;
    petNameDisplay.style.display = 'block';
    nameInputWrapper.style.display = 'none';
  } else {
    petNameDisplay.style.display = 'none';
    nameInputWrapper.style.display = 'flex';
  }
}

btnSaveName.addEventListener('click', () => {
  const namaBaru = inputPetName.value.trim();
  if (namaBaru !== "") {
    localStorage.setItem('mikoPetName', namaBaru);
    checkPetName();
  }
});

btnHeal.addEventListener('click', () => {
  // Membersihkan semua data interval sebelum reload agar memori aman
  clearInterval(gameClock);
  localStorage.removeItem('mikoPetName'); // Opsional: hapus jika ingin ganti nama saat reset
  window.location.reload(); 
});

// Inisialisasi awal saat pertama buka aplikasi
loadFeedLimit();
checkPetName();
updateUI();

