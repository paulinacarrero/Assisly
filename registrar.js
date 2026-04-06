const form = document.getElementById("registroForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const nombreSplit = nombre.split(" ");
    const first_name = nombreSplit[0];
    const last_name = nombreSplit.slice(1).join(" ") || "";

    try {
        const res = await fetch("http://localhost:3000/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                first_name,
                last_name,
                email
            })
        });

        const data = await res.json();
        console.log(data);

        // 🔥 GUARDAMOS EL ID DEL USUARIO
        const userId = data.id;

        // Guardar temporalmente (para usar en la siguiente página)
        localStorage.setItem("student_id", userId);

        // 🔥 REDIRECCIÓN
        window.location.href = "registroRostro.html";

    } catch (error) {
        console.error(error);
        alert("Error al registrar");
    }
});