document.addEventListener('DOMContentLoaded', () => {
    const userOptions = document.querySelectorAll('.user-option');
    const loginButton = document.querySelector('.login-button');
    const userInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');

    const handleUserSelector = (event) => {
        userOptions.forEach(option => {
            option.classList.remove('active');
            option.querySelector('.dot').classList.remove('active-dot');
        });

        const selectedOption = event.currentTarget;
        selectedOption.classList.add('active');
        selectedOption.querySelector('.dot').classList.add('active-dot');
    };

    userOptions.forEach(option => {
        option.addEventListener('click', handleUserSelector);
    });

    loginButton.addEventListener('click', () => {
        const selectedUserType = document.querySelector('.user-option.active').dataset.userType;
        const user = userInput.value;
        const password = passwordInput.value;

        if (user && password) {
            // Hacemos la llamada al backend simulado
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, password, userType: selectedUserType }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Inicio de sesión exitoso. Redirigiendo al dashboard...');
                    // Redirigimos al dashboard.html si el login es exitoso
                    window.location.href = 'dashboard.html'; 
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error en el login:', error);
                alert('Ocurrió un error al intentar iniciar sesión.');
            });
        } else {
            alert('Por favor, ingresa tu usuario y contraseña.');
        }
    });
});
