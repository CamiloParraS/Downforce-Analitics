# Simulador de Downforce y Suspensión para Vehículos de Competición

## Descripción
Este proyecto es un simulador interactivo diseñado para analizar y visualizar el comportamiento de vehículos de competición, con énfasis en la dinámica de downforce y suspensión. La herramienta permite simular y comparar diferentes configuraciones de vehículos, ofreciendo una representación visual de cómo afectan diversos parámetros al rendimiento en pista.

## Características Principales

- **Simulación de Downforce**: Cálculo de la fuerza de sustentación aerodinámica en función de la velocidad y configuración del vehículo.
- **Análisis de Suspensión**: Modelado del comportamiento de la suspensión bajo diferentes condiciones de carga aerodinámica.
- **Comparación de Configuraciones**: Herramienta para comparar múltiples configuraciones de vehículos simultáneamente.
- **Visualización de Datos**: Gráficos interactivos que muestran la relación entre velocidad, downforce y otros parámetros de rendimiento.
- **Modelo Físico Mejorado**: Implementa ecuaciones de dinámica de fluidos y mecánica de vehículos para resultados precisos.

## Tecnologías Utilizadas

- **Frontend**:
  - HTML5, CSS3, JavaScript (ES6+)
  - TailwindCSS para estilos y diseño responsivo
  - Chart.js para visualización de datos
  - Modelo físico personalizado para simulación de dinámica vehicular

- **Herramientas de Desarrollo**:
  - Control de versiones con Git
  - Estructura modular del código para mantenibilidad

## Estructura del Proyecto

- `index.html` - Página principal con el simulador individual
- `comparador.html` - Herramienta para comparar múltiples configuraciones
- `app-individual.js` - Lógica principal de la aplicación para el simulador individual
- `app-comparador.js` - Lógica para la herramienta de comparación
- `physics.js` - Módulo de simulación física que maneja los cálculos de dinámica vehicular
- `cars-data.js` - Datos de configuración de diferentes vehículos
- `GameIconsF1Car.svg` - Recursos gráficos para la interfaz de usuario

## Cómo Usar

1. Abra `index.html` en un navegador web moderno para acceder al simulador individual.
2. Utilice los controles deslizantes para ajustar los parámetros del vehículo.
3. Los gráficos se actualizarán en tiempo real para mostrar el efecto de los cambios.
4. Para comparar configuraciones, acceda a `comparador.html`.

## Aplicaciones

- Análisis de rendimiento aerodinámico
- Educación en dinámica vehicular
- Optimización de configuraciones para simuladores de carreras
- Herramienta didáctica para ingeniería automotriz

## Limitaciones

- El modelo asume condiciones ideales de pista y ambiente.
- Los cálculos son aproximaciones y pueden variar de condiciones reales.
- Se recomienda utilizar como herramienta de referencia y no como sustituto de pruebas reales.


