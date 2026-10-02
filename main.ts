
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