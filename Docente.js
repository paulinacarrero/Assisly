// ─────────────────────────────────────────
//  docente.js  –  Assisly Panel Docente
// ─────────────────────────────────────────
 
// ── Constante de duración del QR (segundos) ──
const DURACION = 300; // 5 minutos
 
let timerInterval   = null;
let tiempoRestante  = DURACION;
 
// ── Al cargar la página ──────────────────
window.addEventListener('DOMContentLoaded', () => {
    // Nombre del docente desde localStorage
    const nombre = localStorage.getItem('nombre')
                || localStorage.getItem('student_id')
                || 'Docente';
    document.getElementById('nombre-docente').textContent = nombre;
 
    // Rellenar hora actual solo si el campo está vacío
    actualizarHora();
});
 
// ── Hora actual ──────────────────────────
function actualizarHora() {
    const ahora = new Date();
    const ampm  = ahora.getHours() >= 12 ? 'PM' : 'AM';
    const h12   = ahora.getHours() % 12 || 12;
    const m     = ahora.getMinutes().toString().padStart(2, '0');
    const campo = document.getElementById('hora');
    if (!campo.value) campo.value = `${h12}:${m} ${ampm}`;
}
 
// ── Generar QR ───────────────────────────
function generarQR() {
    const materia = document.getElementById('materia').value;
    const hora    = document.getElementById('hora').value.trim();
    const aula    = document.getElementById('aula').value.trim();
 
    // Validaciones
    if (!materia) { alert('Por favor selecciona una materia.');    return; }
    if (!hora)    { alert('Por favor ingresa la hora de clase.');  return; }
    if (!aula)    { alert('Por favor ingresa el aula / salón.');   return; }
 
    // Payload que se codifica en el QR
    const payload = JSON.stringify({
        materia,
        hora,
        aula,
        docente   : document.getElementById('nombre-docente').textContent,
        timestamp : new Date().toISOString(),
        token     : Math.random().toString(36).substring(2, 10).toUpperCase()
    });
 
    // Actualizar info visible sobre el QR
    document.getElementById('qr-clase-titulo').textContent = materia;
    document.getElementById('qr-clase-detalle').textContent = `${aula}  •  ${hora}`;
 
    // Limpiar QR anterior y generar nuevo
    const contenedor = document.getElementById('qrcode');
    contenedor.innerHTML = '';
 
    const canvas = document.createElement('canvas');
    contenedor.appendChild(canvas);
 
    QRCode.toCanvas(canvas, payload, {
        width  : 200,
        margin : 1,
        color  : { dark: '#1e1e2e', light: '#ffffff' }
    }, function (error) {
        if (error) {
            contenedor.innerHTML = `
                <div style="width:200px;height:200px;display:flex;flex-direction:column;
                            align-items:center;justify-content:center;
                            background:#fef2f2;border-radius:8px;gap:8px;">
                    <i class="fa-solid fa-triangle-exclamation"
                       style="font-size:32px;color:#ef4444;"></i>
                    <span style="font-size:13px;color:#ef4444;font-weight:600;">
                        Error al generar QR
                    </span>
                </div>`;
            console.error('QR Error:', error);
        }
    });
 
    // Mostrar panel y arrancar temporizador
    document.getElementById('qr-panel').classList.add('visible');
    iniciarTimer();
 
    // Scroll suave hacia el QR
    document.getElementById('qr-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
 
// ── Temporizador ─────────────────────────
function iniciarTimer() {
    clearInterval(timerInterval);
    tiempoRestante = DURACION;
    actualizarTimer();
 
    timerInterval = setInterval(() => {
        tiempoRestante--;
        actualizarTimer();
        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            expirarQR();
        }
    }, 1000);
}
 
function actualizarTimer() {
    const circunferencia = 2 * Math.PI * 18; // r = 18 del SVG
    const offset = circunferencia * (1 - tiempoRestante / DURACION);
    document.getElementById('timer-arc').style.strokeDashoffset = offset;
 
    // Formato mm:ss
    const mins = Math.floor(tiempoRestante / 60);
    const segs = (tiempoRestante % 60).toString().padStart(2, '0');
    const display = `${mins}:${segs}`;
    document.getElementById('timer-num').textContent  = display;
    document.getElementById('timer-texto').textContent = display;
 
    // Cambio de color según tiempo restante
    const arco    = document.getElementById('timer-arc');
    const numEl   = document.getElementById('timer-num');
    const textoEl = document.querySelector('.timer-texto strong');
 
    if (tiempoRestante <= 30) {
        // Rojo — últimos 30 segundos
        arco.style.stroke  = '#ef4444';
        numEl.style.color  = '#ef4444';
        if (textoEl) textoEl.style.color = '#ef4444';
    } else if (tiempoRestante <= 60) {
        // Amarillo — último minuto
        arco.style.stroke  = '#f59e0b';
        numEl.style.color  = '#f59e0b';
        if (textoEl) textoEl.style.color = '#f59e0b';
    } else {
        // Morado — tiempo normal
        arco.style.stroke  = '#7c3aed';
        numEl.style.color  = '#7c3aed';
        if (textoEl) textoEl.style.color = '#7c3aed';
    }
}
 
function expirarQR() {
    document.getElementById('qrcode').innerHTML = `
        <div style="width:200px;height:200px;display:flex;flex-direction:column;
                    align-items:center;justify-content:center;
                    background:#fef2f2;border-radius:8px;gap:8px;">
            <i class="fa-solid fa-clock" style="font-size:36px;color:#ef4444;"></i>
            <span style="font-size:13px;color:#ef4444;font-weight:600;">QR Expirado</span>
            <span style="font-size:11px;color:#9ca3af;">Haz clic en "Renovar QR"</span>
        </div>`;
}
 
// ── Acciones de los botones ───────────────
function regenerarQR() {
    generarQR();
}
 
function cerrarQR() {
    clearInterval(timerInterval);
    document.getElementById('qr-panel').classList.remove('visible');
    document.getElementById('qrcode').innerHTML = '';
}