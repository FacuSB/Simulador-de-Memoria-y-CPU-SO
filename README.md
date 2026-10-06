# Simulador de Memoria y CPU - Sistemas Operativos

Simulador discreto de gestión de memoria y planificación de CPU para la materia de Sistemas Operativos. El proyecto modela procesos, asignación contigua de memoria y ejecución por round-robin con métricas en tiempo real.

## Características

- Gestión de memoria con algoritmos First Fit, Best Fit y Worst Fit
- Simulación de procesos con estados y tiempos de CPU
- Round-robin con quantum configurable
- Coalescencia automática de bloques libres
- Métricas de ocupación, huecos y fragmentación externa
- Tests unitarios con Vitest
- Implementación principal en TypeScript

## Estructura del proyecto

```text
SISTEMASOPERATIVOSAE2/
├── src/
│   ├── main.ts
│   ├── types.ts
│   ├── memoria/
│   │   ├── BloqueMemoria.ts
│   │   └── AdministradorMemoria.ts
│   └── planificacion/
│       ├── Proceso.ts
│       └── SimuladorSO.ts
├── tests/
│   ├── proceso.spec.ts
│   ├── memoria/
│   │   └── administrador-memoria.spec.ts
│   └── simulador/
│       └── simulador.spec.ts
├── main.py
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── .gitignore
└── node_modules/
```

## Archivos principales

- `src/main.ts`: punto de entrada del simulador y exportaciones públicas
- `src/memoria/AdministradorMemoria.ts`: lógica de gestión de memoria y métricas
- `src/memoria/BloqueMemoria.ts`: representación de particiones RAM
- `src/planificacion/Proceso.ts`: PCB del proceso
- `src/planificacion/SimuladorSO.ts`: motor de ejecución y planificación

## Instalación

```bash
npm install
```

## Ejecución

```bash
npx tsx src/main.ts
```

## Tests

```bash
npm test
```

También podes correr cobertura:

```bash
npm run coverage
```

## Clases principales

- `Proceso`: representa cada proceso con su estado, memoria y CPU restante
- `BloqueMemoria`: define una partición contigua en memoria
- `AdministradorMemoria`: asigna memoria y calcula métricas
- `SimuladorSO`: gestiona procesos, la cola de espera, el CPU y el tick del sistema

## Algoritmos de asignación

- `FIRST_FIT`: asigna en el primer hueco que cumple
- `BEST_FIT`: elige el hueco con menor desperdicio
- `WORST_FIT`: elige el hueco más grande disponible

## Estado del proyecto

El proyecto cuenta con 20 tests unitarios cubriendo:

- creación y validación de procesos
- asignación y liberación de memoria
- coalescencia y métricas
- planificación de CPU
- avance de ticks y finalización de procesos
