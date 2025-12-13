document.getElementById("year").innerText = new Date().getFullYear();

function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  const hamburger = document.querySelector(".hamburger");
  navMenu.classList.toggle("show");
  hamburger.classList.toggle("open");
}

function logoutUser() {
  fetch("/logout")
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Swal.fire({
          title: 'Berhasil Keluar!',
          text: data.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: '#f9f9f9',
          color: '#333',
          customClass: { popup: 'rounded-2xl shadow-lg' },
          didClose: () => {
            window.location.href = data.redirect;
          }
        });
      } else {
        Swal.fire({
          title: 'Gagal Logout',
          text: 'Terjadi kesalahan, silakan coba lagi.',
          icon: 'error',
          confirmButtonText: 'Tutup'
        });
      }
    })
    .catch(error => {
      console.error("Logout error:", error);
      Swal.fire({
        title: 'Kesalahan!',
        text: 'Terjadi error saat logout.',
        icon: 'error',
        confirmButtonText: 'Tutup'
      });
    });
}

document.addEventListener('click', function(e) {
  const menu = document.getElementById("navMenu");
  const hamburger = document.querySelector(".hamburger");
  if (menu.classList.contains('show') && !menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove("show");
    hamburger.classList.remove("open");
  }
});

document.querySelectorAll('i[data-color]').forEach(icon => {
  icon.style.color = icon.dataset.color;
});
let currentSlide = 0;
const slidesContainer = document.querySelector('.hero-slider .slides');
const slides = document.querySelectorAll('.hero-slider .slide');
const captions = document.querySelectorAll('.slider-captions .caption');
const dotsContainer = document.querySelector('.slider-dots');
const totalSlides = slides.length;

const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');

let slideWidth = slides[0].clientWidth; // ⭐ PERBAIKAN

function generateDots() {
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.dataset.slideIndex = i;
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }
}

generateDots();
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  slidesContainer.style.transform = `translateX(-${index * slideWidth}px)`; // ⭐ FIX

  captions.forEach(c => c.classList.remove('active'));
  captions[index].classList.add('active');

  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
}

// Panah
arrowRight.addEventListener('click', nextSlide);
arrowLeft.addEventListener('click', prevSlide);

// Resize fix (⭐ sangat penting di mobile)
window.addEventListener("resize", () => {
  slideWidth = slides[0].clientWidth;
  showSlide(currentSlide);
});

// Tampilkan pertama
showSlide(currentSlide);

// Auto-slide
setInterval(nextSlide, 5000);

async function getLaporan() {
  try {
    const [resPemasukan, resPengeluaran] = await Promise.all([
      fetch("/api/pemasukan"),
      fetch("/api/pengeluaran")
    ]);

    const dataPemasukan = await resPemasukan.json();
    const dataPengeluaran = await resPengeluaran.json();

    const elPemasukan = document.getElementById("total-pemasukan");
    const elKas = document.getElementById("total-kas");
    const elPengeluaran = document.getElementById("total-pengeluaran");
    const elIuran = document.getElementById("total-iuran");

    if (elPemasukan) elPemasukan.textContent = "Rp " + dataPemasukan.total_pemasukan.toLocaleString();
    if (elKas) elKas.textContent = "Rp " + dataPemasukan.total_kas.toLocaleString();
    if (elPengeluaran) elPengeluaran.textContent = "Rp " + dataPengeluaran.total_pengeluaran.toLocaleString();
    if (elIuran) elIuran.textContent = "Rp " + dataPengeluaran.total_iuran.toLocaleString();

    const pengeluaranList = document.getElementById("pengeluaran-list");
    const lihatLebihBtn = document.getElementById("lihat-lebih");
    const lihatSedikitBtn = document.getElementById("lihat-sedikit");
    const pengeluaranData = dataPengeluaran.pengeluaran_data;

    if (!pengeluaranData || pengeluaranData.length === 0) {
      pengeluaranList.innerHTML = "<li>Tidak ada data pengeluaran.</li>";
      lihatLebihBtn.style.display = "none";
      lihatSedikitBtn.style.display = "none";
      return;
    }

    let tampil = 1;
    const totalData = pengeluaranData.length;

    function renderList() {
      pengeluaranList.innerHTML = pengeluaranData
        .slice(0, tampil)
        .map(p => `<li>${p.nama_kegiatan} <span>Rp ${p.jumlah.toLocaleString()}</span></li>`)
        .join("");

      if (tampil < totalData) {
        lihatLebihBtn.style.display = "inline-block";
        lihatSedikitBtn.style.display = "none";
      } else {
        lihatLebihBtn.style.display = "none";
        lihatSedikitBtn.style.display = "inline-block";
      }
    }

    lihatLebihBtn.addEventListener("click", () => {
      tampil = totalData;
      renderList();
    });

    lihatSedikitBtn.addEventListener("click", () => {
      tampil = 1;
      renderList();
    });

    renderList();
  } catch (err) {
    console.error("Gagal memuat data laporan:", err);
  }
}

document.addEventListener("DOMContentLoaded", getLaporan);

const tutorialSection = document.getElementById("tutorial");
const tutorialIframe = document.getElementById("tutorialIframe");

if (tutorialSection && tutorialIframe) {
  tutorialSection.addEventListener("click", () => {
    if (tutorialIframe.style.display === "none") {
      tutorialIframe.style.display = "block";
      tutorialSection.querySelector("p").textContent = "Klik lagi untuk menutup video tutorial.";
    } else {
      tutorialIframe.style.display = "none";
      tutorialSection.querySelector("p").textContent = "Klik di sini untuk melihat panduan video penggunaan Portal RT.";
    }
  });
}

window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const suratButton = document.getElementById('ajukan-surat-btn');
  if (suratButton) {
    suratButton.addEventListener('click', function(e) {
      e.preventDefault();
      Swal.fire({
        title: 'UNDER DEVELOPMENT',
        html: 'Saat ini fitur masih dalam tahap pengembangan.',
        icon: 'warning',
        confirmButtonText: 'Mengerti',
        confirmButtonColor: '#34acb0'
      });
    });
  }
});
async function loadDataKeluarga() {
  try {
    const [responseWarga, responseKepala] = await Promise.all([
      fetch('/api/total_keluarga'),
      fetch('/api/total_kepala_keluarga')
    ]);

    const dataWarga = await responseWarga.json();
    const dataKepala = await responseKepala.json();

    document.getElementById('total-keluarga').textContent = dataWarga.total;
    document.getElementById('total-kepala-keluarga').textContent = dataKepala.total_kepala_keluarga;

  } catch (error) {
    console.error('Error fetching data keluarga:', error);
    document.getElementById('total-keluarga').textContent = 'gagal dimuat';
    document.getElementById('total-kepala-keluarga').textContent = 'gagal dimuat';
  }
}

window.addEventListener('DOMContentLoaded', loadDataKeluarga);

function setLastUpdate() {
    const now = new Date().toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short"
    });
    document.getElementById("last-update").innerText = now;
  }
  setLastUpdate();

  document.addEventListener("DOMContentLoaded", function() {
    fetch("/api/peraturan")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("rules-container");
            container.innerHTML = ""; // clear loading

            if (data.status && data.data.length > 0) {
                data.data.forEach((rule, index) => {
                    const li = document.createElement("li");
                    li.innerHTML = `<strong>${index + 1}.</strong> ${rule.isi_peraturan}`;
                    container.appendChild(li);
                });
            } else {
                container.innerHTML = "<li><em>Belum ada peraturan yang tercatat.</em></li>";
            }
        })
        .catch(error => {
            document.getElementById("rules-container").innerHTML =
                "<li><em>Error mengambil data.</em></li>";
            console.error(error);
        });
  });const openBtn = document.getElementById("openSuggestion");
const closeBtn = document.getElementById("closeSuggestion");
const modals = document.getElementById("suggestionModal");
const textarea = document.getElementById("saranInput");
const userInput = document.getElementById("userInput"); // ⬅️ ditambahkan
const sendBtn = document.getElementById("kirimSaran");
const toast = document.getElementById("toast");

openBtn.onclick = () => modals.style.display = "block";
closeBtn.onclick = () => modals.style.display = "none";
modals.onclick = e => { if (e.target === modals) modals.style.display = "none"; };

function showToast(type, text) {
  toast.className = "toast " + type;
  toast.innerHTML = `<i class="fas ${type === "success" ? "fa-check-circle" : "fa-times-circle"}"></i> ${text}`;
  
  toast.style.display = "block";
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.style.display = "none", 200);
  }, 2500);
}

sendBtn.onclick = async () => {
  const isi = textarea.value.trim();
  const user = userInput.value.trim(); // ⬅️ ditambahkan

  if (!user) { 
    showToast("error", "Nama tidak boleh kosong"); 
    return; 
  }

  if (!isi) { 
    showToast("error", "Saran tidak boleh kosong"); 
    return; 
  }

  const original = sendBtn.innerHTML;
  sendBtn.innerHTML = `<div class="spinner"></div>`;
  sendBtn.disabled = true;

  setTimeout(async () => {
    try {
      const res = await fetch("/api/pesan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user, message: isi }) // ⬅️ dikirimkan
      });

      const data = await res.json();

      if (data.status) {
        textarea.value = "";
        userInput.value = ""; // ⬅️ reset nama
        modals.style.display = "none";
        showToast("success", "Saran berhasil dikirim");
      } else {
        showToast("error", "Gagal mengirim saran");
      }
    } catch {
      showToast("error", "Terjadi kesalahan server");
    }

    sendBtn.innerHTML = original;
    sendBtn.disabled = false;
  }, 3000);
};
const logo = document.querySelector('.logo');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) { // ganti 50 sesuai kebutuhan
    logo.classList.add('scrolled');
  } else {
    logo.classList.remove('scrolled');
  }
});
async function fetchVisitCount() {
  try {
    const res = await fetch('/api/visit/count');
    if (!res.ok) throw new Error('Gagal mengambil data');
    const data = await res.json();
    document.getElementById('visit-count').textContent = data.total;
  } catch (err) {
    console.error(err);
    document.getElementById('visit-count').textContent = '-';
  }
}

// Panggil pertama kali
fetchVisitCount();

// Refresh otomatis setiap 5 detik
setInterval(fetchVisitCount, 3600000);