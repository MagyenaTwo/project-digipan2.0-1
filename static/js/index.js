 
function fetchPengeluaran(bulan = '', tahun = '') {
    let url = '/api/pengeluaran';
    if (bulan || tahun) {
        url += `?bulan=${bulan}&tahun=${tahun}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('pengeluaran-ul');
            tableBody.innerHTML = ''; 
            if (data.pengeluaran_data.length > 0) {
                data.pengeluaran_data.forEach(pengeluaran => {
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = '1px solid #ddd';

                    const tdNamaKegiatan = document.createElement('td');
                    tdNamaKegiatan.style.padding = '10px';
                    tdNamaKegiatan.textContent = pengeluaran.nama_kegiatan;
                    tr.appendChild(tdNamaKegiatan);

                    const tdJumlah = document.createElement('td');
                    tdJumlah.style.padding = '10px';
                    tdJumlah.textContent = `Rp ${pengeluaran.jumlah.toLocaleString()}`;
                    tr.appendChild(tdJumlah);

                    tableBody.appendChild(tr);
                });
            } else {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.setAttribute('colspan', '2');
                td.style.textAlign = 'center';
                td.style.color = 'gray';
                td.textContent = 'Tidak ada data pengeluaran.';
                tr.appendChild(td);
                tableBody.appendChild(tr);
            }
            const totalPengeluaran = document.getElementById('total-pengeluaran');
            const totalKas = document.getElementById('total-kas');

            totalPengeluaran.textContent = `Rp ${data.total_pengeluaran.toLocaleString()}`;
            totalKas.textContent = `Rp ${data.total_iuran.toLocaleString()}`; // Menggunakan total_iuran
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
document.getElementById('showPengeluaranBtn').addEventListener('click', function () {
    document.getElementById('pengeluaranModal').style.display = 'block';
    fetchPengeluaran(); 
});

document.getElementById('closeModalBtn').addEventListener('click', function () {
    document.getElementById('pengeluaranModal').style.display = 'none';
});

const filterBtn = document.getElementById('filterBtn');
filterBtn.addEventListener('click', function () {
    const bulan = document.getElementById('filter-bulan').value;
    const tahun = document.getElementById('filter-tahun').value;
    fetchPengeluaran(bulan, tahun); 
});
        window.addEventListener("load", function() {
            const splash = document.getElementById('splashScreen');
            const mainContent = document.getElementById('mainContent');
            
            setTimeout(() => {
                splash.classList.add('hidden'); 
                mainContent.style.display = 'grid'; 
            }, 3000); 
        });
       

        
    const openTutorialBtn = document.getElementById('openTutorialBtn');
    const tutorialModal = document.getElementById('tutorialModal');
    const closeTutorialBtn = document.getElementById('closeTutorialBtn');
    const tutorialIframe = document.getElementById('tutorialIframe');
    openTutorialBtn.onclick = function() {
        tutorialModal.style.display = 'flex';
    }
    closeTutorialBtn.onclick = function() {
        tutorialModal.style.display = 'none';
        stopYouTubeVideo();
    }
    window.onclick = function(event) {
        if (event.target === tutorialModal) {
            tutorialModal.style.display = 'none';
            stopYouTubeVideo();
        }
    }

    
    function stopYouTubeVideo() {
        const iframeSrc = tutorialIframe.src; 
        tutorialIframe.src = '';
        tutorialIframe.src = iframeSrc; 
    }

    const lastUpdateDate = document.getElementById('last-update-date');
const currentDate = new Date().toLocaleString();
lastUpdateDate.textContent = currentDate;

    function toggleSidebar() {
        var sidebar = document.getElementById("sidebar");
        var mainContent = document.getElementById("mainContent");

        if (sidebar.classList.contains("expanded")) {
            sidebar.classList.remove("expanded");
            mainContent.classList.add("expanded");
        } else {
            sidebar.classList.add("expanded");
            mainContent.classList.remove("expanded");
        }
    }

   
    document.addEventListener('click', function(event) {
        var sidebar = document.getElementById('sidebar');
        var menuToggle = document.querySelector('.menu-toggle');
        
       
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            if (sidebar.classList.contains("expanded")) {
                sidebar.classList.remove("expanded");
                var mainContent = document.getElementById("mainContent");
                mainContent.classList.add("expanded");
            }
        }
    });

    
    function closeSidebar() {
        var sidebar = document.getElementById("sidebar");
        if (sidebar.classList.contains("expanded")) {
            sidebar.classList.remove("expanded");
            var mainContent = document.getElementById("mainContent");
            mainContent.classList.add("expanded");
        }
    }


    let kegiatanIndex = 0;

function slideKegiatan() {
    const slider = document.querySelector(".kegiatan-slider");
    const slides = document.querySelectorAll(".kegiatan-slider img");
    const totalSlides = slides.length;

    kegiatanIndex++;

    if (kegiatanIndex >= totalSlides) {
        kegiatanIndex = 0;
    }

    const translateValue = -kegiatanIndex * 100 + "%";
    slider.style.transform = "translateX(" + translateValue + ")";

    setTimeout(slideKegiatan, 3000);
}

document.addEventListener("DOMContentLoaded", slideKegiatan);
function toggleSubMenu(id) {
    var submenu = document.getElementById(id);
    if (submenu.style.display === "none") {
        submenu.style.display = "block";
    } else {
        submenu.style.display = "none";
    }
}