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

document.getElementById('iuran-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const startTime = Date.now();

  const jumlahInput = document.getElementById('jumlah');
  const jumlahBersih = jumlahInput.value.replace(/[^\d]/g, '');
  formData.set('jumlah', jumlahBersih);

  const fileInput = document.getElementById('bukti_pembayaran');
  if (!fileInput.files.length) {
      Swal.fire('Gagal!', 'Silakan pilih file bukti pembayaran.', 'error');
      return;
  }

  Swal.fire({
      title: 'Mengirim Data...',
      text: 'Mohon tunggu sebentar, data sedang diproses.',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
  });

  fetch(form.action, {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (!response.ok) {
          return response.json().then(err => Promise.reject(err.error || 'Gagal mengirim data.'));
      }
      return response.json();
  })
  .then(data => {
      const endTime = Date.now();
      const delay = Math.max(0, 3000 - (endTime - startTime));
      setTimeout(() => {
          Swal.close();
          Swal.fire({
              title: 'Berhasil!',
              text: data.message || 'Iuran berhasil dikirim.',
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
      const delay = Math.max(0, 3000 - (endTime - startTime));
      setTimeout(() => {
          Swal.close();
          Swal.fire({
              title: 'Gagal!',
              text: typeof error === 'string' ? error : 'Terjadi kesalahan saat memproses data.',
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
  $('#nama_keluarga').select2({
      placeholder: "Cari atau Pilih Nama Keluarga",
      allowClear: true,
      width: '100%',
      dropdownParent: $('#nama_keluarga').parent()
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
