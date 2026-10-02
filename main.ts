
// ------------------------------------------------------------------------------
// 1. TIPOS Y ESTRUCTURAS DE DATOS (CLASES BASE)
// ------------------------------------------------------------------------------

export type EstadoProceso =
  | 'NUEVO'
  | 'ESPERANDO_MEMORIA'
  | 'LISTO'
  | 'EJECUTANDO'
  | 'BLOQUEADO'
  | 'TERMINADO';

export type AlgoritmoMemoria = 'FIRST_FIT' | 'BEST_FIT' | 'WORST_FIT';

export interface MetricasMemoria {
  ocupada: number;
  libre_total: number;
  mayor_hueco: number;
  porc_ocupacion: number;
  frag_externa: number;
}

/**
 * Representa el Bloque de Control de Proceso (PCB).
 * Encapsula la información de estado, requisitos y contadores de cada proceso.
 */
export class Proceso {
  private pid: string;
  private tamano_memoria: number;
  private tiempo_cpu_total: number;
  private tiempo_cpu_restante: number;
  private estado: EstadoProceso = 'NUEVO';
  private quantum_consumido: number = 0;
  private tiempo_bloqueo_restante: number = 0;

  constructor(pid: string, tamano_memoria: number, tiempo_cpu_total: number) {
    this.pid = pid;
    this.tamano_memoria = tamano_memoria;
    this.tiempo_cpu_total = tiempo_cpu_total;
    this.tiempo_cpu_restante = tiempo_cpu_total;
  }
}