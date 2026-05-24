const form = document.getElementById("registroForm");
// // ─────────────────────────────────────────
// //  registrar.js  –  Assisly Registro
// // ─────────────────────────────────────────

// // ── 1. Mostrar / ocultar contraseña ──────
// document.querySelectorAll('.contraseña').forEach(container => {
//     const icono = container.querySelector('i');
//     const input = container.querySelector('input');

//     icono.addEventListener('click', () => {
//         input.type = input.type === 'password' ? 'text' : 'password';
//         icono.classList.toggle('fa-eye');
//         icono.classList.toggle('fa-eye-slash');
//     });
// });

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

    const nombre = form.nombre.value;
    const email = form.email.value;
    const password = form.registro_c.value; // Nombre exacto de tu HTML
    const confirmPassword = form.confirmar_c.value;

    // Validar que aceptó los términos
    if (!document.getElementById('check-terminos').checked) {
        alert('Debes aceptar los términos y condiciones.');
        return;
    }

    // Validar contraseñas iguales
    if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden.');
    return;
}

    // Separar nombre y apellido
    const partes     = nombre.split(' ');
    const first_name = partes[0];
    const last_name  = partes.slice(1).join(' ') || '';


try {

    const res = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            password
        })
    });

    // Ver la respuesta real
    const data = await res.json();

    console.log("Respuesta backend:", data);

    if (!res.ok) {
        throw new Error(data.mensaje || "Error en el servidor");
    }

    localStorage.setItem("student_id", data.id);

    alert("Registro exitoso");

    window.location.href = "registroRostro.html";

} catch (error) {
    console.error(error);
    alert("Error al registrar: " + error.message);
}


});
// Seleccionamos todos los contenedores de contraseña
const containers = document.querySelectorAll('.contraseña');

containers.forEach(container => {
    const eyeIcon = container.querySelector('i');
    const input = container.querySelector('input');

    eyeIcon.addEventListener('click', () => {
        // Cambiar tipo de input
        const type = input.type === "password" ? "text" : "password";
        input.type = type;

        // Cambiar icono
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });
});
// const checkbox = document.getElementById('check-terminos');
// const btnSiguiente = document.getElementById('btn-siguiente');

// checkbox.addEventListener('change', function() {
//     // Si el checkbox está marcado, habilitamos el botón
//     btnSiguiente.disabled = !this.checked;
// });

const linkTerminos = document.getElementById('link-terminos');

const checkTerminos = document.getElementById('check-terminos');

// linkTerminos.addEventListener('click', function(e) {
//     e.preventDefault(); // Evita que el enlace navegue

//     const estaVisible = cuadroLegal.style.display === 'block';

//     if (estaVisible) {
//         cuadroLegal.style.display = 'none';
//     } else {
//         cuadroLegal.style.display = 'block';
//     }
// });

// Opcional: cerrar el cuadro si el usuario desmarca el checkbox
checkTerminos.addEventListener('change', function() {
    if (!this.checked) {
        cuadroLegal.style.display = 'none';
    }
});