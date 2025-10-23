
    document.getElementById("year").innerText = new Date().getFullYear();

  function toggleMenu(){
    const navMenu = document.getElementById("navMenu");
    const hamburger = document.querySelector(".hamburger");
    navMenu.classList.toggle("show");
    hamburger.classList.toggle("open");
  }

// --- FUNGSI BARU: Mengirim Formulir sebagai JSON dengan Loading Minimal 3 Detik ---
document.getElementById('family-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const jsonData = {};
    
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });
    
    const startTime = Date.now(); // Catat waktu mulai

    // Tampilkan SweetAlert Loading
    Swal.fire({
        title: 'Mengirim Data...',
        text: 'Mohon tunggu sebentar, data sedang diproses.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });

    // 2. Kirim data menggunakan Fetch API
    fetch(form.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        // Cek jika respons tidak OK
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err.error || 'Gagal mengirim data.'));
        }
        return response.json();
    })
    .then(data => {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const minimumTime = 3000; // 3 detik

        // Tunggu hingga minimal 3 detik tercapai
        const delay = Math.max(0, minimumTime - elapsedTime);

        setTimeout(() => {
            Swal.close(); // Tutup loading
            // Tampilkan notifikasi sukses
            Swal.fire({
                title: 'Berhasil! ',
                text: data.message,
                icon: 'success',
                timer: 2500,
                showConfirmButton: false
            }).then(() => {
                form.reset(); // Kosongkan formulir
            });
        }, delay);
    })
    .catch(error => {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const minimumTime = 3000; // 3 detik
        const delay = Math.max(0, minimumTime - elapsedTime);

        setTimeout(() => {
            Swal.close(); // Tutup loading
            // Tampilkan notifikasi error
            Swal.fire({
                title: 'Gagal!',
                text: typeof error === 'string' ? error : 'Terjadi kesalahan saat memproses data.',
                icon: 'error',
                confirmButtonText: 'Tutup'
            });
        }, delay);
    });
});
// -------------------------------------------------------------------

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
                    customClass: {
                        popup: 'rounded-2xl shadow-lg',
                    },
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

  document.addEventListener('click', function(e){
    const menu = document.getElementById("navMenu");
    const hamburger = document.querySelector(".hamburger");
    if(menu.classList.contains('show') && !menu.contains(e.target) && !hamburger.contains(e.target)){
      menu.classList.remove("show");
      hamburger.classList.remove("open");
    }
  });
  document.querySelectorAll('i[data-color]').forEach(icon => {
  icon.style.color = icon.dataset.color;
});

window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
