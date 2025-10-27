// === physics.js ===
// Modelo físico mejorado para calcular velocidad en función del tiempo y downforce

/**
 * Convierte km/h a m/s
 */
function kmhToMs(v) {
  return v / 3.6;
}

/**
 * Convierte m/s a km/h
 */
function msToKmh(v) {
  return v * 3.6;
}

/**
 * Convierte N a kg (por gravedad)
 */
function NtoKg(F) {
  return F / 9.81;
}

/**
 * Calcula el downforce en un instante dado
 * F_downforce = 0.5 * rho * v^2 * A * CL
 */
function calcularDownforce(v_ms, car) {
  const rho = 1.225; // densidad del aire [kg/m³]
  return 0.5 * rho * v_ms * v_ms * car.A * car.CL;
}

/**
 * Calcula la fuerza de arrastre (drag)
 * F_drag = 0.5 * rho * v^2 * A * CD
 */
function calcularArrastre(v_ms, car) {
  const rho = 1.225;
  return 0.5 * rho * v_ms * v_ms * car.A * car.CD;
}

/**
 * Calcula la aceleración en un instante dado considerando:
 * - Potencia del motor
 * - Resistencia aerodinámica (drag)
 * - Downforce (incrementa fricción en ruedas, afecta ligeramente la aceleración)
 * 
 * a = (P/v - F_drag - F_friccion) / m_efectiva
 */
function calcularAceleracion(v_ms, car) {
  // Evitar división por cero en velocidades muy bajas
  const v_min = 0.5; // m/s (~1.8 km/h)
  if (v_ms < v_min) {
    // A velocidades muy bajas, usar aceleración máxima basada en tracción
    // Aproximadamente a = μ * g donde μ ≈ 1.5 para neumáticos de competición
    const g = 9.81;
    const mu_max = 1.5; // Coeficiente de tracción máximo
    return mu_max * g;
  }
  
  const potencia_w = car.potencia_kw * 1000;
  const F_motor = potencia_w / v_ms; // Fuerza del motor
  const F_drag = calcularArrastre(v_ms, car);
  const F_downforce = calcularDownforce(v_ms, car);
  
  // Fricción adicional por downforce (coeficiente de fricción rodadura ~0.015)
  const F_friccion_downforce = 0.015 * F_downforce;
  
  // Fricción de rodadura base
  const F_friccion_base = 0.015 * car.m * 9.81;
  
  // Masa efectiva (aumenta ligeramente por inercia rotacional de ruedas ~5%)
  const m_efectiva = car.m * 1.05;
  
  // Aceleración neta
  const F_neta = F_motor - F_drag - F_friccion_downforce - F_friccion_base;
  const a = F_neta / m_efectiva;
  
  // Limitar aceleración máxima por tracción
  const F_peso_total = (car.m * 9.81) + F_downforce;
  const F_traccion_max = 1.5 * F_peso_total; // μ * N
  const a_max = F_traccion_max / m_efectiva;
  
  return Math.min(a, a_max);
}

/**
 * Genera los datos de simulación usando integración numérica (Euler mejorado)
 * Calcula velocidad en función del tiempo hasta alcanzar la velocidad máxima
 * 
 * @param {Object} car - Objeto del coche con propiedades físicas
 * @param {number} vmaxKmh - Velocidad máxima deseada para la simulación (km/h)
 * @returns {Array} lista de puntos {t, v, v_ms, downforce_N, downforce_kg, hundimiento_mm}
 */
function generateData(car, vmaxKmh) {
  const g = 9.81;
  const vMaxTarget = Math.min(kmhToMs(vmaxKmh), kmhToMs(car.v_max_kmh));
  
  const dt = 0.05; // paso de tiempo en segundos (más pequeño para mayor precisión)
  const data = [];
  
  // Validar datos base
  if (!car.CL || !car.A || !car.m || !car.potencia_kw) {
    console.warn("Car data incompleta:", car);
    return [];
  }
  
  let t = 0;
  let v_ms = 0.01; // Velocidad inicial muy pequeña para evitar división por cero
  
  // Agregar punto inicial
  data.push({
    t: 0,
    v: 0,
    v_ms: 0,
    downforce_N: 0,
    downforce_kg: 0,
    hundimiento_mm: 50 // Hundimiento base por peso propio
  });
  
  // Integración numérica hasta alcanzar velocidad máxima
  while (v_ms < vMaxTarget && t < 300) { // límite de 300 segundos por seguridad
    // Calcular aceleración en este punto
    const a = calcularAceleracion(v_ms, car);
    
    // Método de Euler: v(t+dt) = v(t) + a(t) * dt
    v_ms += a * dt;
    t += dt;
    
    // Limitar a velocidad máxima del carro
    if (v_ms > kmhToMs(car.v_max_kmh)) {
      v_ms = kmhToMs(car.v_max_kmh);
    }
    
    const v_kmh = msToKmh(v_ms);
    
    // Calcular downforce en este punto
    const downforce_N = calcularDownforce(v_ms, car);
    const downforce_kg = NtoKg(downforce_N);
    
    // Hundimiento de la suspensión
    // k = rigidez de la suspensión (depende del peso del carro)
    const k = (car.m * g) / 0.05; // rigidez: hunde 5 cm por su propio peso
    const hundimiento_m = (downforce_N / (4 * k)) + 0.05; // 4 ruedas
    const hundimiento_mm = hundimiento_m * 1000;
    
    // Guardar datos cada 0.1 segundos aproximadamente
    if (Math.abs(t - Math.round(t / 0.1) * 0.1) < dt / 2) {
      data.push({
        t: parseFloat(t.toFixed(2)),
        v: parseFloat(v_kmh.toFixed(1)),
        v_ms: parseFloat(v_ms.toFixed(2)),
        downforce_N: parseFloat(downforce_N.toFixed(2)),
        downforce_kg: parseFloat(downforce_kg.toFixed(2)),
        hundimiento_mm: parseFloat(hundimiento_mm.toFixed(2))
      });
    }
    
    // Si alcanzamos la velocidad objetivo, salir
    if (v_ms >= vMaxTarget - 0.1) {
      // Agregar el punto final
      data.push({
        t: parseFloat(t.toFixed(2)),
        v: parseFloat(v_kmh.toFixed(1)),
        v_ms: parseFloat(v_ms.toFixed(2)),
        downforce_N: parseFloat(downforce_N.toFixed(2)),
        downforce_kg: parseFloat(downforce_kg.toFixed(2)),
        hundimiento_mm: parseFloat(hundimiento_mm.toFixed(2))
      });
      break;
    }
  }
  
  // Log de debug para verificar que el tiempo se calcula correctamente
  if (data.length > 0) {
    console.log(`${car.name}: Alcanzó ${vmaxKmh} km/h en ${data[data.length-1].t.toFixed(2)}s`);
  }
  
  return data;
}

/**
 * Genera datos para graficar downforce vs velocidad (sin tiempo)
 * Útil para comparar características aerodinámicas puras
 */
function generateDownforceVsVelocity(car, vmaxKmh) {
  const data = [];
  const vMax = Math.min(vmaxKmh, car.v_max_kmh);
  const step = 5; // km/h
  
  for (let v_kmh = 0; v_kmh <= vMax; v_kmh += step) {
    const v_ms = kmhToMs(v_kmh);
    const downforce_N = calcularDownforce(v_ms, car);
    const downforce_kg = NtoKg(downforce_N);
    
    data.push({
      v: v_kmh,
      v_ms,
      downforce_N,
      downforce_kg
    });
  }
  
  return data;
}