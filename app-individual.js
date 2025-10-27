// === app-individual.js ===
// Conecta el DOM con el modelo físico y renderiza los gráficos

// === VARIABLES GLOBALES ===
let selectedCar = null;
let velocityChart, downforceChart, suspensionChart;

// === ELEMENTOS DEL DOM ===
const carSelector = document.getElementById("car-selector");
const velocidadRange = document.getElementById("velocidadFinalRange");
const velocidadLabel = document.getElementById("velocidadLabel");
const generateButton = document.getElementById("generate-button");

// === INICIALIZACIÓN ===
window.addEventListener("DOMContentLoaded", () => {
  cargarCoches();
  carSelector.value = Object.keys(carsData)[0]; // Selecciona el primero por defecto
  selectedCar = carsData[carSelector.value];
  actualizarMaxVelocidad();
  updateCarInfo();
});

// === CARGAR OPCIONES DE VEHÍCULOS ===
function cargarCoches() {
  for (const key in carsData) {
    const car = carsData[key];
    const option = document.createElement("option");
    option.value = key;
    option.textContent = car.name;
    carSelector.appendChild(option);
  }
}

// === ACTUALIZAR MAX VELOCIDAD SEGÚN COCHE ===
function actualizarMaxVelocidad() {
  const car = carsData[carSelector.value];
  const vMax = car.v_max_kmh || 355;

  velocidadRange.max = Math.round(vMax);

  if (parseFloat(velocidadRange.value) > vMax) {
    velocidadRange.value = vMax;
  }

  velocidadLabel.textContent = velocidadRange.value;
}

// === EVENTOS ===
carSelector.addEventListener("change", () => {
  selectedCar = carsData[carSelector.value];
  actualizarMaxVelocidad();
  updateCarInfo();
});

velocidadRange.addEventListener("input", (e) => {
  velocidadLabel.textContent = e.target.value;
});

generateButton.addEventListener("click", () => {
  if (!selectedCar) return;
  const vFinal = parseFloat(velocidadRange.value);
  generateSimulation(selectedCar, vFinal);
});

// === ACTUALIZAR INFORMACIÓN DEL VEHÍCULO ===
function updateCarInfo() {
  const car = selectedCar;
  document.getElementById("car-image").src = car.image || "";
  document.getElementById("info-masa").textContent = `${car.m} kg`;
  document.getElementById("info-velocidad").textContent = "-";
  document.getElementById("info-downforce").textContent = "-";
  document.getElementById("info-hundimiento").textContent = "-";
}

// === GENERAR SIMULACIÓN ===
function generateSimulation(car, vmax) {
  const data = generateData(car, vmax);
  const last = data[data.length - 1];

  document.getElementById("info-velocidad").textContent = `${last.v} km/h`;
  document.getElementById(
    "info-downforce"
  ).textContent = `${last.downforce_kg.toFixed(1)} kg`;
  document.getElementById(
    "info-hundimiento"
  ).textContent = `${last.hundimiento_mm.toFixed(1)} mm`;

  renderCharts(data);
}

// === RENDERIZAR GRÁFICOS ===
function renderCharts(data) {
  const ctxVel = document.getElementById("velocityChart");
  const ctxDown = document.getElementById("downforceChart");
  const ctxSusp = document.getElementById("suspensionChart");

  const labels = data.map((d) => d.v); // eje X = velocidad (km/h)
  const velSquaredData = data.map((d) => d.v_ms * d.v_ms); // eje Y = v² (m²/s²)
  const downData = data.map((d) => d.downforce_kg);
  const suspData = data.map((d) => d.hundimiento_mm);

  // Destruir gráficos previos si existen
  if (velocityChart) velocityChart.destroy();
  if (downforceChart) downforceChart.destroy();
  if (suspensionChart) suspensionChart.destroy();

  // === GRÁFICA 1: Velocidad² (relación cuadrática) ===
  velocityChart = new Chart(ctxVel, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Velocidad² (m²/s²)",
          data: velSquaredData,
          borderColor: "#b91c1c",
          tension: 0.2,
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Velocidad (km/h)" },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Velocidad² (m²/s²)" },
        },
      },
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
    },
  });

  // === GRÁFICA 2: Downforce ===
  downforceChart = new Chart(ctxDown, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Downforce (kg)",
          data: downData,
          borderColor: "#111827",
          tension: 0.2,
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Velocidad (km/h)" } },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Downforce (kg)" },
        },
      },
    },
  });

  // === GRÁFICA 3: Hundimiento de suspensión ===
  suspensionChart = new Chart(ctxSusp, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Hundimiento (mm)",
          data: suspData,
          borderColor: "#e11d48",
          tension: 0.2,
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Velocidad (km/h)" } },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Hundimiento (mm)" },
        },
      },
    },
  });
}
