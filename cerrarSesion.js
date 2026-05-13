const btnLogout = document.getElementById('btn-logout');

btnLogout.addEventListener('click', () => {
    // 1. Borrar todos los datos guardados en el navegador (ID del estudiante, etc.)
    localStorage.clear();
    
    // 2. Opcional: Si usas sessionStorage, también límpialo
    sessionStorage.clear();

    // 3. Redirigir a la página de inicio de sesión o bienvenida
    // Cambia "index.html" por el nombre de tu página principal
    window.location.href = "login.html"; 
    
    // 4. Evitar que el usuario pueda darle "Atrás" y volver a ver sus datos
    window.history.replaceState(null, null, window.location.href);
});