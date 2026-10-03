
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

  // Getters y Setters
  public getPid(): string {
    return this.pid;
  }
  public setPid(pid: string): void {
    this.pid = pid;
  }

  public getTamanoMemoria(): number {
    return this.tamano_memoria;
  }
  public setTamanoMemoria(tamano: number): void {
    this.tamano_memoria = tamano;
  }

  public getTiempoCpuTotal(): number {
    return this.tiempo_cpu_total;
  }
  public setTiempoCpuTotal(tiempo: number): void {
    this.tiempo_cpu_total = tiempo;
  }

  public getTiempoCpuRestante(): number {
    return this.tiempo_cpu_restante;
  }
  public setTiempoCpuRestante(tiempo: number): void {
    this.tiempo_cpu_restante = tiempo;
  }

  public getEstado(): EstadoProceso {
    return this.estado;
  }
  public setEstado(estado: EstadoProceso): void {
    this.estado = estado;
  }

  public getQuantumConsumido(): number {
    return this.quantum_consumido;
  }
  public setQuantumConsumido(quantum: number): void {
    this.quantum_consumido = quantum;
  }

  public getTiempoBloqueoRestante(): number {
    return this.tiempo_bloqueo_restante;
  }
  public setTiempoBloqueoRestante(tiempo: number): void {
    this.tiempo_bloqueo_restante = tiempo;
  }
}