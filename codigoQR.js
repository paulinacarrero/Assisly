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
                let datos;
                try {
                    datos = JSON.parse(decodedText);
                } catch (e) {
                    datos = null;
                }
                if (!datos || !datos.session_id || !datos.token) {
                    resetEscaner();
                    alert('QR no válido. Escanea el código de tu docente.');
                    return;
                }
                registrarAsistencia(datos);
            }).catch(() => resetEscaner());
        },
        () => {} // errores de lectura continuos, ignorar
    ).catch(err => {
        console.error(err);
        resetEscaner();
        alert('No se pudo activar la cámara. Revisa los permisos.');
    });
});

// ── Enviar la asistencia al backend ─────
async function registrarAsistencia(datos) {
    const studentId = localStorage.getItem('student_id');
    if (!studentId) {
        alert('Debes iniciar sesión como estudiante para registrar tu asistencia.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/attendance/scan', {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body   : JSON.stringify({
                student_id: studentId,
                session_id: datos.session_id,
                token     : datos.token
            })
        });
        const respuesta = await res.json().catch(() => ({}));

        if (!res.ok) {
            resetEscaner();
            alert(respuesta.error || 'No se pudo registrar la asistencia.');
            return;
        }

        // Datos confirmados por el servidor
        const clase = {
            materia: respuesta.materia || datos.materia,
            aula   : respuesta.aula    || datos.aula,
            docente: respuesta.docente || datos.docente
        };
        localStorage.setItem('qr_datos', JSON.stringify(clase));
        localStorage.setItem('qr_timestamp', new Date().toISOString());
        mostrarConfirmacion(clase, respuesta.ya_registrada);

    } catch (err) {
        console.error(err);
        resetEscaner();
        alert('Error conectando con el servidor.');
    }
}

function resetEscaner() {
    escaneando = false;
    btnScan.textContent = 'ESCANEAR CÓDIGO QR';
    btnScan.disabled = false;
    if (qrDecorativo) qrDecorativo.style.display = 'block';
}

function mostrarConfirmacion(datos, yaRegistrada = false) {
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

    // Guardar en historial (solo la primera vez que se registra)
    if (!yaRegistrada) {
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
    }

    // Llenar modal
    const nombre = localStorage.getItem('nombre') || 'Estudiante';
    document.getElementById('modal-nombre').textContent  = nombre;
    document.getElementById('modal-materia').textContent = datos.materia || '—';
    document.getElementById('modal-docente').textContent = datos.docente || '—';
    document.getElementById('modal-aula').textContent    = datos.aula    || '—';
    document.getElementById('modal-fecha').textContent   = fechaFormateada;
    document.getElementById('modal-hora').textContent    = hora;
    if (yaRegistrada) {
        document.getElementById('modal-subtitulo').textContent =
            'Tu asistencia ya estaba registrada para esta clase';
    }

    document.getElementById('modal-asistencia').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal-asistencia').style.display = 'none';
    window.location.href = 'Estudiante.html';
}