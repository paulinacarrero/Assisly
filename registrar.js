const form = document.getElementById("registroForm");
const eyeIcon = document.querySelector(".contraseña i"); // Selector más específico
const passwordInput = document.querySelector('input[name="resgistro_c"]');

// 1. Lógica para ver/ocultar contraseña
eyeIcon.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
    }
});

// 2. Lógica de registro
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value;
    const email = form.email.value;
    const password = form.resgistro_c.value; // Nombre exacto de tu HTML
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const nombreSplit = nombre.split(" ");
    const first_name = nombreSplit[0];
    const last_name = nombreSplit.slice(1).join(" ") || "";

    try {
        const student_id = localStorage.getItem("student_id");

        await fetch("http://localhost:3000/upload-face", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            student_id: Number(student_id), // 👈 importante convertir a número
            face_image: imageBase64
        })
        });

        if (!res.ok) throw new Error("Error en el servidor");

        const data = await res.json();
        
        // Guardamos el ID del usuario para la siguiente fase
        localStorage.setItem("student_id", data.id);

        // Redirección al registro de rostro
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
const checkbox = document.getElementById('check-terminos');
const btnSiguiente = document.getElementById('btn-siguiente');

checkbox.addEventListener('change', function() {
    // Si el checkbox está marcado, habilitamos el botón
    btnSiguiente.disabled = !this.checked;
});