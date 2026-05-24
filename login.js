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

const universidadLat = 6.243419058650652, 
const universidadLon = -75.61222400496764;

const RADIO_PERMITIDO = 100;

function calcularDistancia(lat1, lon1, lat2, lon2) {

    const R = 6371e3;

    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;

    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

if (!navigator.geolocation) {

    alert("Tu navegador no soporta geolocalización");
    return;

}

navigator.geolocation.getCurrentPosition(

    (position) => {

        const usuarioLat = position.coords.latitude;
        const usuarioLon = position.coords.longitude;

        const distancia = calcularDistancia(
            usuarioLat,
            usuarioLon,
            universidadLat,
            universidadLon
        );

        console.log("Distancia:", distancia);

        if (distancia <= RADIO_PERMITIDO) {

            alert("📍Estás dentro de la universidad");

            // REDIRECCIÓN
            window.location.href = "rostro.html";

        } else {

            alert("Debes estar dentro de la universidad para tomar tu asistencia");

        }

    },

    (error) => {

        console.log(error);

        alert("Debes permitir la ubicación");

    },

    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }

);
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