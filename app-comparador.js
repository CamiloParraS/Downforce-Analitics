// === app-comparador.js ===
(function () {
  const colors = [
    "#06b6d4", "#dc2626", "#16a34a", "#f59e0b",
    "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"
  ];

  let selectedVehicles = [];
  let vehicleCounter = 0;
  let charts = { velocity: null, downforce: null, suspension: null };

  const velocidadGlobal = document.getElementById("velocidadGlobal");
  const velocidadLabel = document.getElementById("velocidadLabel");
  const vehiclesGrid = document.getElementById("vehicles-grid");
  const addVehicleBtn = document.getElementById("add-vehicle-btn");
  const generateBtn = document.getElementById("generate-button");

  // === EVENTOS GLOBALES ===
  velocidadGlobal.addEventListener("input", () => {
    velocidadLabel.textContent = velocidadGlobal.value;
  });

  addVehicleBtn.addEventListener("click", addVehicleCard);
  generateBtn.addEventListener("click", generateComparison);

  // === CREAR TARJETA DE VEHÍCULO ===
  function addVehicleCard() {
    if (selectedVehicles.length >= 8) {
      alert("Máximo 8 vehículos para comparar");
      return;
    }

    const id = `vehicle-${vehicleCounter++}`;
    const color = colors[selectedVehicles.length % colors.length];
    const carKey = Object.keys(carsData)[0];
    selectedVehicles.push({ id, carKey, color });

    const car = carsData[carKey];

    const card = document.createElement("div");
    card.className =
      "relative bg-red-900 border-4 border-black neobrutalist-shadow-lg p-4 flex flex-col justify-between fade-in";
    card.id = id;

    card.innerHTML = `
      <button class="absolute top-2 right-2 bg-black hover:bg-red-700 text-white font-black px-3 py-1 text-lg rounded" onclick="removeVehicle('${id}')">
        ✕
      </button>

      <div class="bg-white border-4 border-black overflow-hidden mb-4 h-48 flex items-center justify-center">
        <img src="${car.image}" alt="${car.name}" class="object-contain w-full h-full" />
      </div>

      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 border-4 border-black" style="background-color: ${color}"></div>
        <select class="vehicle-selector flex-1 p-2 bg-white text-black font-bold uppercase border-2 border-black">
          ${Object.entries(carsData)
            .map(
              ([key, c]) =>
                `<option value="${key}" ${key === carKey ? "selected" : ""}>${c.name}</option>`
            )
            .join("")}
        </select>
      </div>

      <div class="bg-white border-4 border-black p-3 text-black font-bold">
        <p class="text-xs uppercase mb-1">Datos</p>
        <p class="text-sm"><span class="mass">${car.m}</span> kg • <span class="vmax">${car.v_max_kmh}</span> km/h</p>
      </div>
    `;

    vehiclesGrid.appendChild(card);

    const selector = card.querySelector(".vehicle-selector");
    selector.addEventListener("change", (e) => updateVehicleCard(id, e.target.value));
  }

  // === ACTUALIZAR TARJETA ===
  function updateVehicleCard(id, newKey) {
    const v = selectedVehicles.find((v) => v.id === id);
    if (!v) return;

    v.carKey = newKey;
    const car = carsData[newKey];
    const card = document.getElementById(id);

    // Actualizar imagen y datos
    card.querySelector("img").src = car.image;
    card.querySelector("img").alt = car.name;
    card.querySelector(".mass").textContent = car.m;
    card.querySelector(".vmax").textContent = car.v_max_kmh;
  }

  // === ELIMINAR VEHÍCULO ===
  window.removeVehicle = function (id) {
    selectedVehicles = selectedVehicles.filter((v) => v.id !== id);
    const card = document.getElementById(id);
    if (card) card.remove();
  };

  // === GENERAR COMPARACIÓN ===
  function generateComparison() {
    if (selectedVehicles.length === 0) {
      alert("Agrega al menos un vehículo para comparar");
      return;
    }

    const vFinal = parseFloat(velocidadGlobal.value);
    const velocityDatasets = [];
    const downforceDatasets = [];
    const suspensionDatasets = [];
    const summaryData = [];

    let labels_v2 = [];

    selectedVehicles.forEach((vehicle, index) => {
      const car = carsData[vehicle.carKey];
      const data = generateData(car, vFinal);

      const labels = data.map((d) => Math.pow(d.v, 2)); // eje X = v²
      const velData = data.map((d) => d.v);
      const downData = data.map((d) => d.downforce_kg);
      const suspData = data.map((d) => d.hundimiento_mm);

      if (index === 0) labels_v2 = labels;

      velocityDatasets.push({
        label: car.name,
        data: velData,
        borderColor: vehicle.color,
        borderWidth: 3,
        tension: 0.2,
      });

      downforceDatasets.push({
        label: car.name,
        data: downData,
        borderColor: vehicle.color,
        borderWidth: 3,
        tension: 0.2,
      });

      suspensionDatasets.push({
        label: car.name,
        data: suspData,
        borderColor: vehicle.color,
        borderWidth: 3,
        tension: 0.2,
      });

      const dfMax = Math.max(...downData);
      const porcentaje = (dfMax * 9.81) / (car.m * 9.81) * 100;

      summaryData.push({
        name: car.name,
        mass: car.m,
        downforce: dfMax * 9.81,
        percentage: porcentaje,
        suspension: Math.max(...suspData),
        color: vehicle.color,
      });
    });

    updateSummaryTable(summaryData);
    document.getElementById("charts-section").classList.remove("hidden");
    createCharts(labels_v2, velocityDatasets, downforceDatasets, suspensionDatasets);
  }

  // === TABLA RESUMEN ===
  function updateSummaryTable(summaryData) {
    const tbody = document.getElementById("summary-tbody");
    tbody.innerHTML = summaryData
      .map(
        (d) => `
      <tr class="border-b-2 border-gray-300">
        <td class="p-3 font-bold flex items-center gap-2">
          <div class="w-4 h-4 border-2 border-black" style="background-color: ${d.color}"></div>
          ${d.name}
        </td>
        <td class="text-right p-3 font-bold">${d.mass} kg</td>
        <td class="text-right p-3 font-bold">${d.downforce.toFixed(0)} N</td>
        <td class="text-right p-3 font-bold">${d.percentage.toFixed(1)}%</td>
        <td class="text-right p-3 font-bold">${d.suspension.toFixed(2)} mm</td>
      </tr>
    `
      )
      .join("");
  }

  // === CREAR GRÁFICOS ===
  function createCharts(labels_v2, velocityDatasets, downforceDatasets, suspensionDatasets) {
    const opts = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#000",
            font: { size: 12, weight: "bold", family: "'Courier New', monospace" },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Velocidad² (km²/h²)",
            color: "#000",
            font: { size: 14, weight: "bold" },
          },
          grid: { color: "#e5e5e5" },
          ticks: { color: "#000", font: { weight: "bold" } },
        },
        y: {
          beginAtZero: true,
          grid: { color: "#e5e5e5" },
          ticks: { color: "#000", font: { weight: "bold" } },
        },
      },
    };

    const createChart = (ctxId, datasets, yLabel) => {
      const ctx = document.getElementById(ctxId);
      if (charts[ctxId]) charts[ctxId].destroy();
      charts[ctxId] = new Chart(ctx, {
        type: "line",
        data: { labels: labels_v2, datasets },
        options: {
          ...opts,
          scales: { ...opts.scales, y: { ...opts.scales.y, title: { display: true, text: yLabel } } },
        },
      });
    };

    createChart("velocityChart", velocityDatasets, "Velocidad (km/h)");
    createChart("downforceChart", downforceDatasets, "Downforce (kg)");
    createChart("suspensionChart", suspensionDatasets, "Hundimiento (mm)");
  }

  // === AUTO INICIAL ===
  addVehicleCard();
  addVehicleCard();
})();
