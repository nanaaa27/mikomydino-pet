// ==========================================================================
// 1. DEKLARASI ELEMEN HTML
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

// --- Elemen Baru Untuk Mini-Game ---
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

// Variabel Baru Batas Makan Gratis & Skor Game
let freeFeedCount = 3; 
let isMiniGamePlaying = false;
let score = 0;
let checkCollisionInterval;
let obstacleScoreInterval;

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
  
  // Update info sisa kuota makan gratis ke tombol
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
    } else {
      petAvatar.textContent = '🦕';
      petExpression.textContent = '(◕‿◕)';
      petStatusText.textContent = 'Kondisi: Bahagia 🌿';
    }
  }
}

// ==========================================================================
// 4. LOGIKA BATASAN MAKAN GRATIS (REAL TIME 24 JAM)
// ==========================================================================
function loadFeedLimit() {
  const today = new Date().toDateString(); // Ambil tanggal hari ini (Format teks biasa)
  const savedDate = localStorage.getItem('lastFeedDate');
  const savedCount = localStorage.getItem('freeFeedCount');

  if (savedDate !== today) {
    // Kalau hari baru, reset jatah makan gratis jadi 3 kali
    freeFeedCount = 3;
    localStorage.setItem('lastFeedDate', today);
    localStorage.setItem('freeFeedCount', freeFeedCount);
  } else if (savedCount !== null) {
    // Kalau hari yang sama, teruskan sisa kuota lama
    freeFeedCount = parseInt(savedCount);
  }
}

// ==========================================================================
// 5. EVENT BUTTON MAKAN, TOKO, DAN TIDUR
// ==========================================================================
btnFeed.addEventListener('click', () => {
  if (!isAlive || isSleeping) return;

  loadFeedLimit(); // Cek tanggal dulu sebelum kasih makan

  if (freeFeedCount > 0) {
    freeFeedCount--; // Kurangi jatah makan gratis
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
    alert("🍦 Premium! Energi Miko bertambah pesat!");
  } else {
    alert("❌ Koin kurang! Main mini game dulu yuk.");
  }
});

// --- RAHASIA BARU: TOMBOL SAKLAR MATIKAN LAMPU (UPGRADE GLOBAL DARK MODE) ---
btnSleep.addEventListener('click', () => {
  if (!isAlive) return;

  // Bolak-balik status tidurnya (Kalau true jadi false, kalau false jadi true)
  isSleeping = !isSleeping;

  // == LINE SAKTI: Menghidupkan/mematikan mode gelap di seluruh body web ==
  document.body.classList.toggle('dark-theme');

  if (isSleeping) {
    // 1. Jika lampu dimatikan (Tidur)
    petDisplayBox.classList.add('night-mode'); // Pasang tema malam di kotak dino
    btnSleep.classList.add('active-sleep');    // Ubah warna tombol jadi gelap
    btnSleep.innerHTML = '<span class="icon">💡</span> Nyalakan Lampu (Bangun)';
    
    // Kunci tombol aksi agar transparan/buram tanda gak bisa diklik
    btnFeed.style.opacity = '0.5';
    btnPlay.style.opacity = '0.5';
    shopSection.style.opacity = '0.5';
  } else {
    // 2. Jika lampu dinyalakan kembali (Bangun)
    petDisplayBox.classList.remove('night-mode'); // Balik ke langit senja cerah
    btnSleep.classList.remove('active-sleep');
    btnSleep.innerHTML = '<span class="icon">💡</span> Matikan Lampu (Tidur)';
    
    // Kembalikan tombol aksi jadi tajam lagi
    btnFeed.style.opacity = '1';
    btnPlay.style.opacity = '1';
    shopSection.style.opacity = '1';
  }

  // Refresh visual layar untuk mengganti ekspresi Dino
  updateUI();
});


// ==========================================================================
// 6. MODUL MINI-GAME: DINO JUMP INTERAKTIF
// ==========================================================================
btnPlay.addEventListener('click', () => {
  if (!isAlive || isSleeping) return;
  
  // Sembunyikan layar utama, tampilkan arena lompat game
  isMiniGamePlaying = true;
  mainPetDisplay.style.display = 'none';
  mainStatusSection.style.display = 'none';
  shopSection.style.display = 'none';
  btnSleep.style.display = 'none';
  btnFeed.style.display = 'none';
  btnPlay.style.display = 'none';
  
  miniGameBox.style.display = 'flex';
  
  // Memulai status game dari awal
  score = 0;
  miniGameScore.textContent = `Skor: ${score}`;
  gameObstacle.classList.add('obstacle-move'); // Mulai jalankan cangkir matcha jalannya cepat
  
  startMiniGameEngine();
});

// Deteksi klik di seluruh kotak mini-game agar dino melompat
miniGameBox.addEventListener('click', () => {
  // Hanya melompat jika dino sedang menapak tanah (tidak sedang melompat)
  if (!gameDino.classList.contains('dino-jump-animation')) {
    gameDino.classList.add('dino-jump-animation');
    
    // Setelah animasi lompat selesai (500ms), copot kelasnya biar bisa lompat lagi
    setTimeout(() => {
      gameDino.classList.remove('dino-jump-animation');
    }, 500);
  }
});

function startMiniGameEngine() {
  // A. Mesin Hitung Skor (Setiap 2 detik berhasil lolos rintangan)
  obstacleScoreInterval = setInterval(() => {
    score += 10;
    miniGameScore.textContent = `Skor: ${score}`;
  }, 2000);

  // B. Mesin Tabrakan (Mengecek posisi pixel koordinat Dino vs Cangkir)
  checkCollisionInterval = setInterval(() => {
    // Tangkap posisi koordinat real-time elemen di layar browser
    let dinoBottom = parseInt(window.getComputedStyle(gameDino).getPropertyValue("bottom"));
    let obstacleLeft = parseInt(window.getComputedStyle(gameObstacle).getPropertyValue("left"));
    let boxWidth = miniGameBox.offsetWidth;
    
    // Hitung perkiraan posisi tabrakan (ketika posisi X berhimpitan dan Y dino sedang di bawah)
    if (obstacleLeft > 20 && obstacleLeft < 60 && dinoBottom <= 20) {
      endMiniGame();
    }
  }, 50);
}

function endMiniGame() {
  // Hentikan semua mesin game loop
  clearInterval(checkCollisionInterval);
  clearInterval(obstacleScoreInterval);
  gameObstacle.classList.remove('obstacle-move');
  
  // Tambahkan skor game langsung ke dompet koin utama
  coins += score;
  happiness = Math.min(100, happiness + 20); // Bonus bahagia setelah bermain
  gainXP(score); // Bonus XP sebesar skor yang didapat!

  alert(`💥 Nabrak! Game Over.\nKamu berhasil mengumpulkan ${score} 🪙 Koin.`);
  
  // Tutup arena game, kembalikan ke layar aslinya
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
// 7. FUNGSI UTALITAS TAMBAHAN
// ==========================================================================
function gainXP(amount) {
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

btnHeal.addEventListener('click', () => { window.location.reload(); });

// Inisialisasi awal saat pertama buka aplikasi
loadFeedLimit();
checkPetName();
updateUI();
