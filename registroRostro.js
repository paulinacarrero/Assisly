function abrirCamara() {
  const video = document.getElementById("video");
  const foto = document.getElementById("foto");
  const camaraBox = document.querySelector(".camara-box");

  // 🔥 animaciones
  camaraBox.classList.add("camara-grande");
  camaraBox.classList.add("camara-activa");

  foto.style.display = "none";
  video.style.display = "block";

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(error => {
      alert("No se pudo acceder a la cámara");
    });
}
function tomarFoto() {
  const video = document.getElementById("video");
  const canvas = document.createElement("canvas");
  const foto = document.getElementById("foto");
  const camaraBox = document.querySelector(".camara-box");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  foto.src = canvas.toDataURL("image/png");

  foto.style.display = "block";
  video.style.display = "none";

  // 🔥 quitar animaciones
  camaraBox.classList.remove("camara-activa");

  // apagar cámara
  const stream = video.srcObject;
  stream.getTracks().forEach(track => track.stop());
}