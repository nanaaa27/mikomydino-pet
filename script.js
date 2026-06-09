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
const petDisplayBox = document.querySelector('.pet-display-box'); // Tangkap kotak dunianya

const btnFeed = document.getElementById('btnFeed');
const btnPlay = document.getElementById('btnPlay');
const btnHeal = document.getElementById('btnHeal');

const coinText = document.getElementById('coinText');
const btnBuyIceCream = document.getElementById('btnBuyIceCream');
const shopSection = document.getElementById('shopSection');

const levelText = document.getElementById('levelText');
const xpText = document.getElementById('xpText');
const xpFill = document.getElementById('xpFill');

// --- Element Baru untuk Tombol Tidur ---
const btnSleep = document.getElementById('btnSleep');

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

// Variabel Mode Tidur Baru
let isSleeping = false; // Status awal: Lampu menyala (bangun)

// ==========================================================================
// 3. FUNGSI UPDATE TAMPILAN LAYAR (UI)
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

  // --- CEK PERUBAHAN VISUAL KONDISI NYAWA ---
  if (!isAlive) return; // Jika sudah mati, abaikan fungsi di bawah ini

  if (isSleeping) {
    // KONDISI KHUSUS: Sedang Tidur Nyenyak
    petAvatar.textContent = '💤';
    petExpression.textContent = '(＿ ＿).｡oO';
    petStatusText.textContent = 'Kondisi: Tidur Nyenyak 😴';
    petStatusText.style.backgroundColor = '#2b3252';
    petStatusText.style.color = '#ffffff';
  } 
  else {
    // KONDISI NORMAL: Saat Bangun (Sama Seperti Kemarin)
    if (energy <= 0 || happiness <= 0) {
      isAlive = false;
      petAvatar.textContent = '💀';
      petExpression.textContent = '(✖╭╮✖)';
      petStatusText.textContent = 'Kondisi: Pingsan 😢';
      petStatusText.style.backgroundColor = '#fcdede';
      petStatusText.style.color = '#c94a4a';
      petAura.style.background = 'none';
      
      btnFeed.style.display = 'none';
      btnPlay.style.display = 'none';
      btnSleep.style.display = 'none';
      shopSection.style.display = 'none';
      btnHeal.style.display = 'flex';
      
      petAvatar.style.animation = 'none';
      petAvatar.classList.remove('animate-panic');
    } 
    else if (energy <= 30 || happiness <= 30) {
      petAvatar.textContent = '🦕';
      petExpression.textContent = '(ಥ﹏ಥ)';
      petStatusText.textContent = 'Kondisi: Sekarat! 🚨';
      petStatusText.style.backgroundColor = '#fff3cd';
      petStatusText.style.color = '#856404';
      petAvatar.classList.add('animate-panic');
    } 
    else if (energy <= 60 || happiness <= 60) {
      petAvatar.textContent = '🦕';
      petExpression.textContent = '(◕_◕)';
      petStatusText.textContent = 'Kondisi: Butuh Perhatian';
      petStatusText.style.backgroundColor = 'var(--matcha-light)';
      petStatusText.style.color = 'var(--matcha-dark)';
      petAvatar.classList.remove('animate-panic');
    } 
    else {
      petAvatar.textContent = '🦕';
      petExpression.textContent = '(◕‿◕)';
      petStatusText.textContent = 'Kondisi: Bahagia 🌿';
      petStatusText.style.backgroundColor = 'var(--matcha-light)';
      petStatusText.style.color = 'var(--matcha-dark)';
      petAvatar.classList.remove('animate-panic');
    }
  }
}

// ==========================================================================
// 4. LOGIKA JALANNYA XP & LEVEL UP
// ==========================================================================
function gainXP(amount) {
  if (!isAlive || isSleeping) return; // XP tidak bisa bertambah kalau tidur
  xp += amount;
  if (xp >= xpNeeded) {
    level += 1;
    xp = xp - xpNeeded;
    xpNeeded = Math.round(xpNeeded * 1.5);
    alert(`🎉 LEVEL UP! Miko naik ke Level ${level}! Makin pintar dan kuat! 🦕✨`);
  }
  updateUI();
}

// ==========================================================================
// 5. LOGIKA JAM GAME (PENGURANGAN NYAWA OTOMATIS)
// ==========================================================================
const gameClock = setInterval(() => {
  // RAHASIA UTAMA: Hanya kurangi nyawa kalau Miko sedang BANGUN (!isSleeping)
  if (isAlive && !isSleeping) {
    energy = Math.max(0, energy - 5);
    happiness = Math.max(0, happiness - 8);
    updateUI();
  }
  // Kalau mati, matikan jam
  if (!isAlive) clearInterval(gameClock);
}, 10000);

// ==========================================================================
// 6. EVENT LISTENER TOMBOL-TOMBOL AKSI
// ==========================================================================

// Kasih Makan (Hanya bisa diklik kalau Miko bangun)
btnFeed.addEventListener('click', () => {
  if (!isAlive || isSleeping) return;
  energy = Math.min(100, energy + 10);
  triggerPopAnimation();
  gainXP(15);
});

// Ajak Main (Hanya bisa diklik kalau Miko bangun)
btnPlay.addEventListener('click', () => {
  if (!isAlive || isSleeping) return;
  happiness = Math.min(100, happiness + 15);
  coins += 10;
  triggerPopAnimation();
  gainXP(25);
});

// Beli Es Krim (Hanya bisa diklik kalau Miko bangun)
btnBuyIceCream.addEventListener('click', () => {
  if (!isAlive || isSleeping) return;
  const hargaEsKrim = 30;
  if (coins >= hargaEsKrim) {
    coins -= hargaEsKrim;
    energy = Math.min(100, energy + 40);
    triggerPopAnimation();
    alert("🍦 Nyam! Miko suka banget Matcha Ice Cream Premium!");
    gainXP(50);
  } else {
    alert("❌ Koinmu gak cukup! Yuk ajak Miko main dulu buat cari koin.");
  }
});

// --- RAHASIA BARU: TOMBOL SAKLAR MATIKAN LAMPU ---
btnSleep.addEventListener('click', () => {
  if (!isAlive) return;

  // Bolak-balik status tidurnya (Kalau true jadi false, kalau false jadi true)
  isSleeping = !isSleeping;

  if (isSleeping) {
    // 1. Jika lampu dimatikan (Tidur)
    petDisplayBox.classList.add('night-mode'); // Pasang tema malam dari CSS
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

// Tombol Reset
btnHeal.addEventListener('click', () => {
  window.location.reload();
});

// Fungsi Animasi Pop
function triggerPopAnimation() {
  petAvatar.classList.add('animate-pop');
  setTimeout(() => {
    petAvatar.classList.remove('animate-pop');
  }, 400);
}

// Jalankan aplikasi pertama kali
updateUI();
