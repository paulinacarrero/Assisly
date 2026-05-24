// ─────────────────────────────────────────
//  registrar.js  –  Assisly Registro
// ─────────────────────────────────────────

// ── 1. Mostrar / ocultar contraseña ──────
document.querySelectorAll('.contraseña').forEach(container => {
    const icono = container.querySelector('i');
    const input = container.querySelector('input');

    icono.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password';
        icono.classList.toggle('fa-eye');
        icono.classList.toggle('fa-eye-slash');
    });
});

// ── 2. Modal de términos y condiciones ───
document.getElementById('link-terminos').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('modal-terminos').style.display = 'block';
});

// Cerrar al hacer clic en el fondo oscuro
document.getElementById('modal-terminos').addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
});

function cerrarModal() {
    document.getElementById('modal-terminos').style.display = 'none';
}

function aceptarTerminos() {
    document.getElementById('check-terminos').checked = true;
    cerrarModal();
}

// ── 3. Envío del formulario de registro ──
document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form      = e.target;
    const nombre    = form.nombre.value.trim();
    const email     = form.email.value.trim();
    const password  = form.registro_c.value;
    const confirmar = form.confirmar_c.value;

    // Validar que aceptó los términos
    if (!document.getElementById('check-terminos').checked) {
        alert('Debes aceptar los términos y condiciones.');
        return;
    }

    // Validar contraseñas iguales
    if (password !== confirmar) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    // Separar nombre y apellido
    const partes     = nombre.split(' ');
    const first_name = partes[0];
    const last_name  = partes.slice(1).join(' ') || '';

    try {
        const res = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name, last_name, email, password })
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.error || 'Error en el servidor');
            return;
        }

        const data = await res.json();

        // Guardar ID para la siguiente fase (registro de rostro)
        localStorage.setItem('student_id', data.id);

        // Redirigir al registro de rostro
        window.location.href = 'registroRostro.html';

    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor.');
    }
});