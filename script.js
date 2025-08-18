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
      window.location.href = './home/dashboard.html'

    } catch (error) {}
  });
});

// Barras apiladas
new Chart(document.getElementById("stackedBarChart"), {
  type: "bar",
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Ventas",
        data: [200, 250, 300, 280],
        backgroundColor: "#36a2eb"
      },
      {
        label: "Gastos",
        data: [120, 180, 160, 190],
        backgroundColor: "#ff6384"
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  }
});

// Línea múltiple
new Chart(document.getElementById("multiLineChart"), {
  type: "line",
  data: {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Usuarios Activos",
        data: [120, 150, 200, 180, 250, 300],
        borderColor: "#36a2eb",
        fill: false,
        tension: 0.3
      },
      {
        label: "Usuarios Nuevos",
        data: [80, 100, 150, 130, 200, 220],
        borderColor: "#ff6384",
        fill: false,
        tension: 0.3
      }
    ]
  }
});

// Donut doble
new Chart(document.getElementById("doubleDoughnutChart"), {
  type: "doughnut",
  data: {
    labels: ["Completado", "Pendiente"],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ["#36a2eb", "#e0e0e0"],
        weight: 1
      },
      {
        data: [50, 50],
        backgroundColor: ["#4bc0c0", "#f0f0f0"],
        weight: 0.6
      }
    ]
  }
});

// Dispersión
new Chart(document.getElementById("scatterChart"), {
  type: "scatter",
  data: {
    datasets: [{
      label: "Muestras",
      data: [
        {x: 5, y: 7}, {x: 8, y: 12}, {x: 12, y: 5}, {x: 15, y: 10}, {x: 20, y: 8}
      ],
      backgroundColor: "#36a2eb"
    }]
  }
});
