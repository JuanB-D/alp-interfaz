document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.querySelector(".login-container");
  const loginButton = document.querySelector(".login-button");
  const responseMessage = document.querySelector(".response-message");

  loginContainer.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {};
    const formData = new FormData(loginContainer);
    formData.forEach((value, key) => (data[key] = value));
    loginButton.textContent = "Enviando...";
    loginButton.disabled = true;
    try {
      const response = await fetch(
        "https://eduanalitycsapi-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        responseMessage.textContent = responseData.message;
        responseMessage.style.color = "red";
        loginButton.textContent = "Iniciar Sesión";
        loginButton.disabled = false;
        console.log(responseData)
        return;
      }
      localStorage.setItem('teacher-data', JSON.stringify({name:responseData.message.name, token:responseData.message.token}));
      window.location.href = './dashboard.html'

    } catch (error) {}
  });
});
