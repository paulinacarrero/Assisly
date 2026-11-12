// ─────────────────────────────────────────
//  Docente.js  –  Assisly Panel Docente
// ─────────────────────────────────────────

const API             = 'http://localhost:3000';
const REFRESCO_LISTA  = 5000; // ms entre actualizaciones de la lista de hoy

const teacherId = localStorage.getItem('teacher_id');

let materiaActual    = null;  // { course_id, name, classroom, schedule }
let timerInterval    = null;
let listaInterval    = null;
let duracionQR       = 120;
let tiempoRestante   = 0;

// ── Al cargar la página ──────────────────
window.addEventListener('DOMContentLoaded', () => {
    if (!teacherId || localStorage.getItem('rol') !== 'docente') {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('nombre-docente').textContent =
        localStorage.getItem('nombre') || 'Docente';

    cargarMaterias();
});

// ── Utilidades ───────────────────────────
function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

function fechaHoy() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
}

async function api(ruta, opciones = {}) {
    const res = await fetch(API + ruta, {
        headers: { 'Content-Type': 'application/json' },
        ...opciones
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Error de conexión con el servidor');
    return data;
}

// ── Vista 1: materias ────────────────────
async function cargarMaterias() {
    const lista = document.getElementById('materias-lista');
    try {
        const materias = await api(`/teachers/${teacherId}/courses`);

        if (materias.length === 0) {
            lista.innerHTML = `
                <div class="mensaje-vacio">
                    <i class="fa-solid fa-book-open"></i>
                    Aún no tienes materias asignadas.<br>
                    El usuario administrativo debe registrarlas.
                </div>`;
            return;
        }

        lista.innerHTML = '';
        materias.forEach(m => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'materia-card';
            card.innerHTML = `
                <div class="materia-icono"><i class="fa-solid fa-book"></i></div>
                <div class="materia-texto">
                    <div class="materia-nombre">${escapar(m.name)}</div>
                    <div class="materia-detalle">
                        <span><i class="fa-solid fa-location-dot"></i>${escapar(m.classroom)}</span>
                        ${m.schedule ? `<span><i class="fa-solid fa-clock"></i>${escapar(m.schedule)}</span>` : ''}
                        <span><i class="fa-solid fa-users"></i>${m.total_estudiantes} estudiantes</span>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-right"></i>`;
            card.addEventListener('click', () => abrirMateria(m));
            lista.appendChild(card);
        });
    } catch (err) {
        lista.innerHTML = `
            <div class="mensaje-vacio error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                ${escapar(err.message)}
            </div>`;
    }
}

// ── Vista 2: detalle de materia ──────────
function abrirMateria(materia) {
    materiaActual = materia;

    document.getElementById('materia-titulo').textContent = materia.name;
    document.getElementById('materia-detalle').innerHTML = `
        <span><i class="fa-solid fa-location-dot"></i>${escapar(materia.classroom)}</span>
        ${materia.schedule ? `<span><i class="fa-solid fa-clock"></i>${escapar(materia.schedule)}</span>` : ''}`;
    document.getElementById('header-subtitulo').textContent = 'Genera el código QR para tu clase';

    ocultarQR();
    document.getElementById('fecha-asistencia').value = fechaHoy();

    document.getElementById('vista-materias').classList.remove('visible');
    document.getElementById('vista-materia').classList.add('visible');

    cargarAsistencia();
}

function volverAMaterias() {
    detenerTimer();
    clearInterval(listaInterval);
    materiaActual = null;

    document.getElementById('header-subtitulo').textContent = 'Selecciona una de tus materias';
    document.getElementById('vista-materia').classList.remove('visible');
    document.getElementById('vista-materias').classList.add('visible');
    cargarMaterias(); // refresca el número de inscritos
}

// ── Generar / renovar QR ─────────────────
async function generarQR() {
    if (!materiaActual) return;
    const boton = document.getElementById('btn-generar');
    boton.disabled = true;

    try {
        const sesion = await api(`/courses/${materiaActual.course_id}/qr`, {
            method: 'POST',
            body: JSON.stringify({ teacher_id: teacherId })
        });

        // Lo que lee el estudiante al escanear
        const payload = JSON.stringify({
            session_id: sesion.session_id,
            token     : sesion.token,
            materia   : sesion.materia,
            aula      : sesion.aula,
            docente   : sesion.docente
        });

        const contenedor = document.getElementById('qrcode');
        contenedor.innerHTML = '';
        const canvas = document.createElement('canvas');
        contenedor.appendChild(canvas);

        QRCode.toCanvas(canvas, payload, {
            width : 220,
            margin: 1,
            color : { dark: '#1e1e2e', light: '#ffffff' }
        }, (error) => {
            if (error) {
                console.error('QR Error:', error);
                mostrarEstadoQR('fa-triangle-exclamation', 'Error al generar QR', '');
            }
        });

        boton.style.display = 'none';
        document.getElementById('timer-container').style.display = 'flex';
        document.getElementById('qr-panel').classList.add('visible');
        iniciarTimer(sesion.expira_en);

        // La fecha de la clase es hoy: mostrar esa lista
        document.getElementById('fecha-asistencia').value = sesion.fecha;
        cargarAsistencia();
    } catch (err) {
        alert(err.message);
    } finally {
        boton.disabled = false;
    }
}

async function cerrarClase() {
    if (!materiaActual) return;
    try {
        await api(`/courses/${materiaActual.course_id}/qr/close`, {
            method: 'POST',
            body: JSON.stringify({ teacher_id: teacherId })
        });
    } catch (err) {
        alert(err.message);
        return;
    }
    ocultarQR();
    cargarAsistencia();
}

function ocultarQR() {
    detenerTimer();
    document.getElementById('qr-panel').classList.remove('visible');
    document.getElementById('qrcode').innerHTML = '';
    const boton = document.getElementById('btn-generar');
    boton.style.display = 'flex';
}

function mostrarEstadoQR(icono, titulo, detalle) {
    document.getElementById('qrcode').innerHTML = `
        <div class="qr-estado">
            <i class="fa-solid ${icono}"></i>
            <span>${titulo}</span>
            ${detalle ? `<small>${detalle}</small>` : ''}
        </div>`;
}

// ── Temporizador ─────────────────────────
function iniciarTimer(segundos) {
    detenerTimer();
    duracionQR = segundos;
    tiempoRestante = segundos;
    actualizarTimer();

    timerInterval = setInterval(() => {
        tiempoRestante--;
        actualizarTimer();
        if (tiempoRestante <= 0) {
            detenerTimer();
            mostrarEstadoQR('fa-clock', 'QR Expirado', 'Haz clic en "Renovar QR"');
            document.getElementById('timer-container').style.display = 'none';
        }
    }, 1000);
}

function detenerTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function actualizarTimer() {
    const circunferencia = 2 * Math.PI * 18; // r = 18 del SVG
    const offset = circunferencia * (1 - tiempoRestante / duracionQR);
    const arco = document.getElementById('timer-arc');
    arco.style.strokeDashoffset = offset;

    const mins = Math.floor(tiempoRestante / 60);
    const segs = (tiempoRestante % 60).toString().padStart(2, '0');
    document.getElementById('timer-num').textContent   = `${mins}:${segs}`;
    document.getElementById('timer-texto').textContent = `${mins}:${segs}`;

    // Morado → amarillo (último minuto) → rojo (últimos 30 s)
    const color = tiempoRestante <= 30 ? '#ef4444'
                : tiempoRestante <= 60 ? '#f59e0b'
                : '#7c3aed';
    arco.style.stroke = color;
    document.getElementById('timer-num').style.color   = color;
    document.getElementById('timer-texto').style.color = color;
}

// ── Lista de asistencia ──────────────────
async function cargarAsistencia() {
    if (!materiaActual) return;
    const fecha = document.getElementById('fecha-asistencia').value || fechaHoy();
    const lista = document.getElementById('estudiantes-lista');

    // Solo la lista de hoy se actualiza sola (es la que cambia mientras escanean)
    clearInterval(listaInterval);
    if (fecha === fechaHoy()) {
        listaInterval = setInterval(() => refrescarAsistencia(fecha), REFRESCO_LISTA);
    }

    lista.innerHTML = `<div class="mensaje-vacio"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</div>`;
    await refrescarAsistencia(fecha);
}

async function refrescarAsistencia(fecha) {
    const lista = document.getElementById('estudiantes-lista');
    const cursoId = materiaActual?.course_id;
    try {
        const data = await api(
            `/courses/${cursoId}/attendance?teacher_id=${teacherId}&date=${fecha}`
        );
        // Ignorar respuestas viejas si el docente cambió de materia o de fecha
        if (materiaActual?.course_id !== cursoId ||
            document.getElementById('fecha-asistencia').value !== fecha) return;

        pintarAsistencia(data);
    } catch (err) {
        lista.innerHTML = `
            <div class="mensaje-vacio error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                ${escapar(err.message)}
            </div>`;
    }
}

function pintarAsistencia(data) {
    const lista = document.getElementById('estudiantes-lista');
    const asistieron = data.estudiantes.filter(e => e.asistio).length;

    document.getElementById('total-si').textContent = asistieron;
    document.getElementById('total-no').textContent = data.estudiantes.length - asistieron;
    document.getElementById('aviso-sin-clase').hidden = data.hubo_clase;

    if (data.estudiantes.length === 0) {
        lista.innerHTML = `
            <div class="mensaje-vacio">
                <i class="fa-solid fa-user-slash"></i>
                No hay estudiantes inscritos en esta materia.
            </div>`;
        return;
    }

    // Primero los que asistieron, luego los que no
    const ordenados = [...data.estudiantes].sort((a, b) => b.asistio - a.asistio);

    lista.innerHTML = ordenados.map(e => {
        const iniciales = `${e.first_name?.[0] || ''}${e.last_name?.[0] || ''}`.toUpperCase();
        const hora = e.recorded_at
            ? new Date(e.recorded_at.replace(' ', 'T')).toLocaleTimeString('es-CO',
                  { hour: '2-digit', minute: '2-digit', hour12: true })
            : '';
        const estado = e.asistio
            ? `<span class="estado-asistencia si"><i class="fa-solid fa-check"></i> Asistió</span>
               <span class="estado-hora">${hora}</span>`
            : `<span class="estado-asistencia no"><i class="fa-solid fa-xmark"></i> No asistió</span>`;

        return `
            <div class="estudiante-fila">
                <div class="estudiante-avatar">${escapar(iniciales)}</div>
                <div class="estudiante-texto">
                    <div class="estudiante-nombre">${escapar(e.first_name)} ${escapar(e.last_name)}</div>
                    <div class="estudiante-email">${escapar(e.email)}</div>
                </div>
                <div>${estado}</div>
            </div>`;
    }).join('');
}

// ── Cerrar sesión ─────────────────────────
function cerrarSesionDocente() {
    ['teacher_id', 'rol', 'nombre'].forEach(k => localStorage.removeItem(k));
}
