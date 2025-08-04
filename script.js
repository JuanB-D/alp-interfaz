document.addEventListener('DOMContentLoaded', () => {
    const userOptions = document.querySelectorAll('.user-option');
    
    // Función para manejar el cambio de selección del tipo de usuario
    const handleUserSelector = (event) => {
        userOptions.forEach(option => {
            option.classList.remove('active');
            option.querySelector('.dot').classList.remove('active-dot');
        });

        const selectedOption = event.currentTarget;
        selectedOption.classList.add('active');
        selectedOption.querySelector('.dot').classList.add('active-dot');
    };

    // Agregar el evento de clic a cada opción
    userOptions.forEach(option => {
        option.addEventListener('click', handleUserSelector);
    });

    // Función para simular el inicio de sesión
    const loginButton = document.querySelector('.login-button');
    loginButton.addEventListener('click', () => {
        const selectedUserType = document.querySelector('.user-option.active').dataset.userType;
        const usuario = document.querySelector('input[type="text"]').value;
        const contrasena = document.querySelector('input[type="password"]').value;

        // Aquí podrías agregar la lógica real para validar los datos
        // Por ahora, solo mostraremos los datos en la consola
        console.log(`Tipo de usuario: ${selectedUserType}`);
        console.log(`Usuario: ${usuario}`);
        console.log(`Contraseña: ${contrasena}`);

        if (usuario && contrasena) {
            alert(`Inicio de sesión simulado como ${selectedUserType}.`);
            // Aquí podrías redirigir al usuario a otra página
            // window.location.href = 'dashboard.html';
        } else {
            alert('Por favor, ingresa tu usuario y contraseña.');
        }
    });
});
