// ─────────────────────────────────────────
//  codigoQR.js  
// ─────────────────────────────────────────

const btnScan      = document.getElementById('btn-scan');
const qrDecorativo = document.getElementById('qr-decorativo');
let escaneando     = false;

btnScan.addEventListener('click', () => {
    if (escaneando) return;
    escaneando = true;

    if (qrDecorativo) qrDecorativo.style.display = 'none';
    btnScan.textContent = 'Escaneando...';
    btnScan.disabled = true;

    const html5QrCode = new Html5Qrcode("reader");

    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 }
    };

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
            html5QrCode.stop().then(() => {
                try {
                    const datos = JSON.parse(decodedText);

                    // Guardar datos del QR para usarlos después
                    localStorage.setItem('qr_datos', JSON.stringify(datos));
                    localStorage.setItem('qr_timestamp', new Date().toISOString());

                    // Mostrar modal con la info de la clase
                    mostrarConfirmacion(datos);

                } catch(e) {
                    resetEscaner();
                    alert('QR no válido. Escanea el código de tu docente.');
                }
            }).catch(() => resetEscaner());
        },
        () => {} // errores de lectura continuos, ignorar
    ).catch(err => {
        console.error(err);
        resetEscaner();
        alert('No se pudo activar la cámara. Revisa los permisos.');
    });
});

function resetEscaner() {
    escaneando = false;
    btnScan.textContent = 'ESCANEAR CÓDIGO QR';
    btnScan.disabled = false;
    if (qrDecorativo) qrDecorativo.style.display = 'block';
}

function mostrarConfirmacion(datos) {
    const ahora = new Date();

    const fecha = ahora.toLocaleDateString('es-CO', {
        weekday: 'long',
        year:    'numeric',
        month:   'long',
        day:     'numeric'
    });
    const fechaFormateada = fecha.charAt(0).toUpperCase() + fecha.slice(1);

    const hora = ahora.toLocaleTimeString('es-CO', {
        hour:   '2-digit',
        minute: '2-digit',
        hour12: true
    });

    // Guardar en historial
    const historial = JSON.parse(localStorage.getItem('historial_asistencias') || '[]');
    historial.push({
        materia  : datos.materia  || '—',
        aula     : datos.aula     || '—',
        docente  : datos.docente  || '—',
        fecha    : fechaFormateada,
        hora     : hora,
        timestamp: ahora.toISOString()
    });
    localStorage.setItem('historial_asistencias', JSON.stringify(historial));

    // Llenar modal
    const nombre = localStorage.getItem('nombre') || 'Estudiante';
    document.getElementById('modal-nombre').textContent  = nombre;
    document.getElementById('modal-materia').textContent = datos.materia || '—';
    document.getElementById('modal-docente').textContent = datos.docente || '—';
    document.getElementById('modal-aula').textContent    = datos.aula    || '—';
    document.getElementById('modal-fecha').textContent   = fechaFormateada;
    document.getElementById('modal-hora').textContent    = hora;

    document.getElementById('modal-asistencia').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal-asistencia').style.display = 'none';
    window.location.href = 'estudiante.html';
}