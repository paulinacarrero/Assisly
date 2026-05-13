const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Error en login");
            return;
        }

        // 🔥 Guardar sesión
        localStorage.setItem("student_id", data.student_id);

        alert("Login exitoso 🎉");

        // Redirección
        window.location.href = "rostro.html";

    } catch (error) {
        console.error(error);
        alert("Error conectando con el servidor");
    }
});


const eyeIcon = document.querySelector(".contraseña i");
const passwordInput = document.querySelector('input[name="password"]');

console.log("eyeIcon:", eyeIcon);       // ¿encuentra el elemento?
console.log("passwordInput:", passwordInput); // ¿encuentra el input?

eyeIcon.addEventListener("click", () => {
    console.log("Click detectado"); // ¿se ejecuta al hacer click?
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    }
});