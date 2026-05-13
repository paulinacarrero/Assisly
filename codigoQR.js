const btnScan = document.getElementById('btn-scan');
const qrDecorativo = document.getElementById('qr-decorativo');

btnScan.addEventListener('click', () => {
    // 1. Ocultamos la imagen del teléfono/QR inmediatamente
    if (qrDecorativo) {
        qrDecorativo.style.display = 'none';
    }

    // 2. Iniciamos el escáner en el contenedor "reader"
    const html5QrCode = new Html5Qrcode("reader");

    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
    };

    html5QrCode.start(
        { facingMode: "user" }, // Cambia a "environment" para la cámara trasera en celular
        config,
        (decodedText) => {
            // Acción cuando detecta el QR
            alert("Asistencia registrada: " + decodedText);
            
            // Opcional: Detener la cámara y volver a mostrar la imagen
            html5QrCode.stop().then(() => {
                qrDecorativo.style.display = 'block';
            });
        }
    ).catch(err => {
        console.error("Error de cámara:", err);
        // Si falla la cámara, volvemos a mostrar la imagen para que no quede vacío
        qrDecorativo.style.display = 'block';
        alert("No se pudo activar la cámara. Revisa los permisos.");
    });
});