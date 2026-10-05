# Simulador de Memoria y CPU - Sistemas Operativos

Simulador discreto de gestión de memoria (particiones contiguas) y planificación de CPU (Round-Robin) desarrollado para la cátedra de Sistemas Operativos.

## Características

- **Gestión de Memoria**: Asignación contigua con algoritmos First Fit, Best Fit y Worst Fit
- **Planificación de CPU**: Round-Robin con quantum configurable
- **Coalescencia**: Fusión automática de bloques libres contiguos
- **Métricas en tiempo real**: Uso de CPU, fragmentación externa, ocupación de memoria
- **Bloqueo por E/S**: Simulación de operaciones de entrada/salida
- **Dual implementation**: Implementaciones en TypeScript y Python

## Estructura del Proyecto

```
├── main.ts              # Implementación principal en TypeScript
├── main.py              # Implementación equivalente en Python
├── tests/
│   └── main.spec.ts     # Tests unitarios (Vitest)
├── package.json         # Dependencias del proyecto
├── tsconfig.json        # Configuración de TypeScript
├── vitest.config.ts     # Configuración de Vitest
└── .gitignore
```

## Instalación

```bash
npm install
```

## Ejecución

**TypeScript:**
```bash
npx tsx main.ts
```

**Python:**
```bash
python main.py
```

## Tests

```bash
npm test
```

## Clases Principales

| Clase | Descripción |
|-------|-------------|
| `Proceso` | Bloque de Control de Proceso (PCB) con estado, memoria y CPU |
| `BloqueMemoria` | Partición contigua en RAM (libre u ocupada) |
| `AdministradorMemoria` | Gestiona 1024 KB con First/Best/Worst Fit |
| `SimuladorSO` | Motor del simulador con Round-Robin y métricas |

## Algoritmos de Asignación de Memoria

- **First Fit**: Asigna al primer hueco libre suficientemente grande
- **Best Fit**: Asigna al hueco que genera menor desperdicio
- **Worst Fit**: Asigna al hueco más grande disponible
