// ─────────────────────────────────────────
//  estudiante.js  –  Perfil del Estudiante
// ─────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
    cargarPerfil();
    cargarHistorial();
});

// ── Cargar nombre y foto del perfil ──────
function cargarPerfil() {
    const nombre = localStorage.getItem('nombre') || 'Estudiante';
    document.getElementById('perfil-nombre').textContent = nombre;

    // Si hay foto guardada del rostro, mostrarla
    const foto = localStorage.getItem('foto_perfil');
    if (foto) {
        const img = document.getElementById('foto-perfil');
        const placeholder = document.getElementById('avatar-placeholder');
        img.src = foto;
        img.style.display = 'block';
        placeholder.style.display = 'none';
    }
}

// ── Cargar historial de asistencias ──────
function cargarHistorial() {
    const lista = document.getElementById('historial-lista');
    const historial = JSON.parse(localStorage.getItem('historial_asistencias') || '[]');

    if (historial.length === 0) {
        lista.innerHTML = `
            <div class="historial-vacio">
                <i class="fa-solid fa-calendar-xmark"></i>
                <p>Aún no tienes asistencias registradas</p>
            </div>`;
        return;
    }

    // Mostrar del más reciente al más antiguo
    const ordenado = [...historial].reverse();

    lista.innerHTML = ordenado.map(item => `
        <div class="historial-item">
            <div class="historial-icono">
                <i class="fa-solid fa-book"></i>
            </div>
            <div>
                <div class="historial-materia">${item.materia}</div>
                <div class="historial-detalle">${item.aula} · ${item.docente}</div>
            </div>
            <div class="historial-hora">
                <div class="historial-hora-texto">${item.hora}</div>
                <div class="historial-fecha-texto">${item.fecha}</div>
            </div>
        </div>
    `).join('');
}

// ── Cerrar sesión ─────────────────────────
function cerrarSesion() {
    // Conservar historial y datos de sesión mínimos
    const historial = localStorage.getItem('historial_asistencias');
    localStorage.clear();
    if (historial) localStorage.setItem('historial_asistencias', historial);
}