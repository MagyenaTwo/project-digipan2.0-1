document.getElementById("year").innerText = new Date().getFullYear();

function toggleMenu(){
  const navMenu = document.getElementById("navMenu");
  const hamburger = document.querySelector(".hamburger");
  navMenu.classList.toggle("show");
  hamburger.classList.toggle("open");
}

function formatRupiah(angka) {
  let number_string = angka.replace(/[^,\d]/g, '').toString(),
      split = number_string.split(','),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  return rupiah;
}

const jumlahInput = document.getElementById('jumlah');
if (jumlahInput) {
  jumlahInput.addEventListener('keyup', function(e) {
      let cleanValue = this.value.replace('Rp ', '').replace(/\./g, '');
      this.value = 'Rp ' + formatRupiah(cleanValue);
  });

  if (jumlahInput.value) {
      jumlahInput.value = 'Rp ' + formatRupiah(jumlahInput.value.replace('Rp ', '').replace(/\./g, ''));
  }
}
document.getElementById('form-surat').addEventListener('submit', function(e) {
  e.preventDefault();

  const form = e.target;
  const startTime = Date.now();

  // Ambil semua nilai input dari form
  const data = {
    nama: document.getElementById("nama").value.trim(),
    tempatlahir: document.getElementById("tempatlahir").value.trim(),
    tanggal: document.getElementById("tanggal").value,
    jeniskelamin: document.getElementById("jeniskelamin").value,
    agama: document.getElementById("agama").value,
    statusperkawinan: document.getElementById("statusperkawinan").value,
    jenissurat: document.getElementById("jenissurat").value,
    pekerjaan: document.getElementById("pekerjaan") ? document.getElementById("pekerjaan").value : "",
    ktp: document.getElementById("ktp") ? document.getElementById("ktp").value : "",
    alamatktp: document.getElementById("alamatktp") ? document.getElementById("alamatktp").value : "",
    tujuan: document.getElementById("tujuan") ? document.getElementById("tujuan").value : ""
  };

  // Validasi sederhana
  if (!data.nama || !data.jenissurat || !data.tanggal) {
    Swal.fire('Gagal!', 'Mohon isi semua data wajib.', 'error');
    return;
  }

  // Tampilkan Swal Loading
  Swal.fire({
    title: 'Mengirim Data...',
    text: 'Mohon tunggu sebentar, data sedang dikirim.',
    icon: 'info',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading()
  });

  // Kirim ke API Flask
  fetch('/kirim-surat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err.message || 'Gagal mengirim surat.'));
    }
    return response.json();
  })
  .then(result => {
    const endTime = Date.now();
    const delay = Math.max(0, 2500 - (endTime - startTime));

    setTimeout(() => {
      Swal.close();
      Swal.fire({
        title: 'Berhasil!',
        text: result.message || 'Surat berhasil dikirim.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
       }).then(() => {
              form.reset();
              window.location.href = '/main';
          });
      }, delay);
  })
  .catch(error => {
    const endTime = Date.now();
    const delay = Math.max(0, 2500 - (endTime - startTime));

    setTimeout(() => {
      Swal.close();
      Swal.fire({
        title: 'Gagal!',
        text: typeof error === 'string' ? error : 'Terjadi kesalahan saat mengirim surat.',
        icon: 'error',
        confirmButtonText: 'Tutup'
      });
    }, delay);
  });
});


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


$(document).ready(function() {
  $('#jenissurat').select2({
      placeholder: "Pilih jenis surat",
      allowClear: true,
      width: '100%',
      dropdownParent: $('#jenissurat').parent()
  });
});

window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
