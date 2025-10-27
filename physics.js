// === physics.js ===
// Modelo físico para calcular velocidad, downforce y hundimiento

/**
 * Convierte km/h a m/s
 */
function kmhToMs(v) {
  return v / 3.6;
}

/**
 * Convierte N a kg (por gravedad)
 */
function NtoKg(F) {
  return F / 9.81;
}

/**
 * Genera los datos de simulación hasta una velocidad final.
 * 
 * @param {Object} car - Objeto del coche con propiedades físicas
 * @param {number} vmaxKmh - Velocidad máxima para la simulación (km/h)
 * @returns {Array} lista de puntos {v, downforce_N, downforce_kg, hundimiento_mm}
 */
function generateData(car, vmaxKmh) {
  const rho = 1.225; // densidad del aire [kg/m³]
  const g = 9.81;
  const vMax = kmhToMs(vmaxKmh);

  const step = 5; // paso en km/h
  const data = [];

  // --- Validar datos base ---
  if (!car.CL || !car.A || !car.m) {
    console.warn("Car data incompleta:", car);
    return [];
  }

  for (let v = 0; v <= vmaxKmh; v += step) {
    const v_ms = kmhToMs(v);

    // === Downforce ===
    // F = 0.5 * rho * v^2 * A * CL
    const downforce_N = 0.5 * rho * v_ms * v_ms * car.A * car.CL;
    const downforce_kg = NtoKg(downforce_N);

    // === Hundimiento de la suspensión ===
    // suposición: suspensión más blanda -> más hundimiento
    // usamos una constante de rigidez arbitraria k = m * g / (hundimiento base)
    // y luego sumamos efecto del downforce
    const k = (car.m * g) / 0.05; // rigidez típica: hunde 5 cm por su propio peso
    const hundimiento_m = (downforce_N / (4 * k)) + 0.05; // 4 ruedas, aprox
    const hundimiento_mm = hundimiento_m * 1000;

    data.push({
      v: Math.round(v),
      v_ms,
      downforce_N,
      downforce_kg,
      hundimiento_mm
    });
  }

  return data;
}
