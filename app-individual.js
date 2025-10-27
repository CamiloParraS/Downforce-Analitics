// === app-individual.js ===
// Conecta el DOM con el modelo físico y renderiza los gráficos

// === VARIABLES GLOBALES ===
let selectedCar = null;
let velocityChart, downforceVsTimeChart, downforceVsVelocityChart, suspensionChart;

// === ELEMENTOS DEL DOM ===
const carSelector = document.getElementById("car-selector");
const velocidadRange = document.getElementById("velocidadFinalRange");
const velocidadLabel = document.getElementById("velocidadLabel");
const generateButton = document.getElementById("generate-button");

// === INICIALIZACIÓN ===
window.addEventListener("DOMContentLoaded", () => {
  cargarCoches();
  carSelector.value = Object.keys(carsData)[0];
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
  velocidadRange.value = Math.round(vMax); // También actualizar el valor actual al máximo

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
  document.getElementById("info-potencia").textContent = `${car.potencia_kw} kW`;
  document.getElementById("info-velocidad").textContent = "-";
  document.getElementById("info-downforce").textContent = "-";
  document.getElementById("info-hundimiento").textContent = "-";
  document.getElementById("info-tiempo").textContent = "-";
}

// === GENERAR SIMULACIÓN ===
function generateSimulation(car, vmax) {
  const data = generateData(car, vmax);
  const last = data[data.length - 1];

  document.getElementById("info-velocidad").textContent = `${last.v} km/h`;
  document.getElementById("info-downforce").textContent = `${last.downforce_kg.toFixed(1)} kg`;
  document.getElementById("info-hundimiento").textContent = `${last.hundimiento_mm.toFixed(1)} mm`;
  document.getElementById("info-tiempo").textContent = `${last.t.toFixed(1)} s`;

  renderCharts(data, car, vmax);
}

// === RENDERIZAR GRÁFICOS ===
function renderCharts(data, car, vmax) {
  const ctxVel = document.getElementById("velocityChart");
  const ctxDownTime = document.getElementById("downforceVsTimeChart");
  const ctxDownVel = document.getElementById("downforceVsVelocityChart");
  const ctxSusp = document.getElementById("suspensionChart");

  // Datos basados en tiempo
  const labels_time = data.map((d) => d.t);
  const velData = data.map((d) => d.v);
  const downData = data.map((d) => d.downforce_kg);
  const suspData = data.map((d) => d.hundimiento_mm);

  // Datos downforce vs velocidad (curva pura)
  const downforceVsVelData = generateDownforceVsVelocity(car, vmax);
  const labels_vel = downforceVsVelData.map((d) => d.v);
  const downVsVelData = downforceVsVelData.map((d) => d.downforce_kg);

  // Destruir gráficos previos
  if (velocityChart) velocityChart.destroy();
  if (downforceVsTimeChart) downforceVsTimeChart.destroy();
  if (downforceVsVelocityChart) downforceVsVelocityChart.destroy();
  if (suspensionChart) suspensionChart.destroy();

  // === GRÁFICA 1: Velocidad vs Tiempo ===
  velocityChart = new Chart(ctxVel, {
    type: "line",
    data: {
      labels: labels_time,
      datasets: [{
        label: "Velocidad (km/h)",
        data: velData,
        borderColor: "#b91c1c",
        tension: 0.3,
        borderWidth: 3,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Tiempo (s)" } },
        y: { beginAtZero: true, title: { display: true, text: "Velocidad (km/h)" } },
      },
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
    },
  });

  // === GRÁFICA 2: Downforce vs Tiempo ===
  downforceVsTimeChart = new Chart(ctxDownTime, {
    type: "line",
    data: {
      labels: labels_time,
      datasets: [{
        label: "Downforce (kg)",
        data: downData,
        borderColor: "#111827",
        tension: 0.3,
        borderWidth: 3,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Tiempo (s)" } },
        y: { beginAtZero: true, title: { display: true, text: "Downforce (kg)" } },
      },
    },
  });

  // === GRÁFICA 3: Downforce vs Velocidad (curva característica) ===
  downforceVsVelocityChart = new Chart(ctxDownVel, {
    type: "line",
    data: {
      labels: labels_vel,
      datasets: [{
        label: "Downforce (kg)",
        data: downVsVelData,
        borderColor: "#16a34a",
        tension: 0.2,
        borderWidth: 3,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Velocidad (km/h)" } },
        y: { beginAtZero: true, title: { display: true, text: "Downforce (kg)" } },
      },
    },
  });

  // === GRÁFICA 4: Hundimiento de suspensión vs Tiempo ===
  suspensionChart = new Chart(ctxSusp, {
    type: "line",
    data: {
      labels: labels_time,
      datasets: [{
        label: "Hundimiento (mm)",
        data: suspData,
        borderColor: "#e11d48",
        tension: 0.3,
        borderWidth: 3,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Tiempo (s)" } },
        y: { beginAtZero: true, title: { display: true, text: "Hundimiento (mm)" } },
      },
    },
  });
}