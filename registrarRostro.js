let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let foto = document.getElementById("foto");

// 🔥 Obtener el ID del usuario guardado
const studentId = localStorage.getItem("student_id");

// Validación importante
if (!studentId) {
    alert("No hay usuario registrado. Vuelve al registro.");
    window.location.href = "index.html";
}

// Abrir cámara
function abrirCamara() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error(err);
            alert("Error al acceder a la cámara");
        });
}

// Tomar foto
function tomarFoto() {
    const context = canvas.getContext("2d");

    canvas.width = 320;
    canvas.height = 240;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.5);

    // Mostrar la foto
    foto.src = imageData;

    // Enviar al backend
    guardarRostro(imageData);
}

// Enviar imagen al backend
async function guardarRostro(imageData) {

    try {
        const res = await fetch("http://localhost:3000/upload-face", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                student_id: studentId,
                face_image: imageData
            })
        });

        const data = await res.json();

        console.log(data);
        alert("Rostro guardado correctamente 🎉");

    } catch (error) {
        console.error(error);
        alert("Error al guardar el rostro");
    }
}

const studentID = localStorage.getItem("student_id");

fetch(`http://localhost:3000/student/${studentID}`)
.then(res => res.json())
.then(data => {
    document.getElementById("imagenUsuario").src = data.face_image_path;
});