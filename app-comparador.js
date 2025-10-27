// === app-comparador.js ===
(function () {
  const colors = [
    "#06b6d4", "#dc2626", "#16a34a", "#f59e0b",
    "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"
  ];

  let selectedVehicles = [];
  let vehicleCounter = 0;
  let charts = { 
    velocityTime: null, 
    downforceTime: null, 
    downforceVelocity: null, 
    suspension: null 
  };

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
        <p class="text-xs mt-1"><span class="power">${car.potencia_kw}</span> kW</p>
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

    card.querySelector("img").src = car.image;
    card.querySelector("img").alt = car.name;
    card.querySelector(".mass").textContent = car.m;
    card.querySelector(".vmax").textContent = car.v_max_kmh;
    card.querySelector(".power").textContent = car.potencia_kw;
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
    
    // Datasets para gráficas basadas en tiempo
    const velocityTimeDatasets = [];
    const downforceTimeDatasets = [];
    const suspensionDatasets = [];
    
    // Datasets para downforce vs velocidad
    const downforceVelocityDatasets = [];
    
    const summaryData = [];

    let maxTime = 0;
    let labelsTime = [];

    selectedVehicles.forEach((vehicle, index) => {
      const car = carsData[vehicle.carKey];
      const data = generateData(car, vFinal);
      
      // Datos vs tiempo
      const labels_t = data.map((d) => d.t);
      const velData = data.map((d) => d.v);
      const downData = data.map((d) => d.downforce_kg);
      const suspData = data.map((d) => d.hundimiento_mm);

      if (data.length > 0 && data[data.length - 1].t > maxTime) {
        maxTime = data[data.length - 1].t;
        labelsTime = labels_t;
      }

      velocityTimeDatasets.push({
        label: car.name,
        data: velData.map((v, i) => ({ x: labels_t[i], y: v })),
        borderColor: vehicle.color,
        backgroundColor: vehicle.color + '20',
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 0,
      });

      downforceTimeDatasets.push({
        label: car.name,
        data: downData.map((d, i) => ({ x: labels_t[i], y: d })),
        borderColor: vehicle.color,
        backgroundColor: vehicle.color + '20',
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 0,
      });

      suspensionDatasets.push({
        label: car.name,
        data: suspData.map((s, i) => ({ x: labels_t[i], y: s })),
        borderColor: vehicle.color,
        backgroundColor: vehicle.color + '20',
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 0,
      });

      // Downforce vs velocidad (curva característica)
      const downVsVel = generateDownforceVsVelocity(car, vFinal);
      const dfVelData = downVsVel.map(d => ({ x: d.v, y: d.downforce_kg }));
      
      downforceVelocityDatasets.push({
        label: car.name,
        data: dfVelData,
        borderColor: vehicle.color,
        backgroundColor: vehicle.color + '20',
        borderWidth: 3,
        tension: 0.2,
        pointRadius: 0,
      });

      // Resumen
      const dfMax = Math.max(...downData);
      const porcentaje = (dfMax * 9.81) / (car.m * 9.81) * 100;
      const timeToMax = data.length > 0 ? data[data.length - 1].t : 0;

      summaryData.push({
        name: car.name,
        mass: car.m,
        power: car.potencia_kw,
        timeToMax: timeToMax,
        downforce: dfMax * 9.81,
        percentage: porcentaje,
        suspension: Math.max(...suspData),
        color: vehicle.color,
      });
    });

    updateSummaryTable(summaryData);
    document.getElementById("charts-section").classList.remove("hidden");
    createCharts(velocityTimeDatasets, downforceTimeDatasets, downforceVelocityDatasets, suspensionDatasets);
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
        <td class="text-right p-3 font-bold">${d.power} kW</td>
        <td class="text-right p-3 font-bold">${d.timeToMax.toFixed(1)} s</td>
        <td class="text-right p-3 font-bold">${d.downforce.toFixed(0)} N</td>
        <td class="text-right p-3 font-bold">${d.percentage.toFixed(1)}%</td>
        <td class="text-right p-3 font-bold">${d.suspension.toFixed(2)} mm</td>
      </tr>
    `
      )
      .join("");
  }

  // === CREAR GRÁFICOS ===
  function createCharts(velocityTimeDatasets, downforceTimeDatasets, downforceVelocityDatasets, suspensionDatasets) {
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
          type: 'linear',
          title: {
            display: true,
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

    const createChart = (ctxId, datasets, xLabel, yLabel) => {
      const ctx = document.getElementById(ctxId);
      if (charts[ctxId]) charts[ctxId].destroy();
      
      charts[ctxId] = new Chart(ctx, {
        type: "line",
        data: { datasets },
        options: {
          ...opts,
          scales: { 
            ...opts.scales, 
            x: { 
              ...opts.scales.x, 
              title: { ...opts.scales.x.title, text: xLabel } 
            },
            y: { 
              ...opts.scales.y, 
              title: { display: true, text: yLabel, color: "#000", font: { size: 14, weight: "bold" } } 
            } 
          },
        },
      });
    };

    createChart("velocityTimeChart", velocityTimeDatasets, "Tiempo (s)", "Velocidad (km/h)");
    createChart("downforceTimeChart", downforceTimeDatasets, "Tiempo (s)", "Downforce (kg)");
    createChart("downforceVelocityChart", downforceVelocityDatasets, "Velocidad (km/h)", "Downforce (kg)");
    createChart("suspensionChart", suspensionDatasets, "Tiempo (s)", "Hundimiento (mm)");
  }

  // === AUTO INICIAL ===
  addVehicleCard();
  addVehicleCard();
})();