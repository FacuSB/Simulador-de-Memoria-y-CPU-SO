
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

/**
 * Representa una partición contigua dentro del espacio total de la RAM.
 */
export class BloqueMemoria {
  private inicio: number;
  private tamano: number;
  private libre: boolean;
  private pid: string | null;

  constructor(inicio: number, tamano: number, libre: boolean = true, pid: string | null = null) {
    this.inicio = inicio;
    this.tamano = tamano;
    this.libre = libre;
    this.pid = pid;
  }

  // Getters y Setters
  public getInicio(): number {
    return this.inicio;
  }
  public setInicio(inicio: number): void {
    this.inicio = inicio;
  }

  public getTamano(): number {
    return this.tamano;
  }
  public setTamano(tamano: number): void {
    this.tamano = tamano;
  }

  public isLibre(): boolean {
    return this.libre;
  }
  public setLibre(libre: boolean): void {
    this.libre = libre;
  }

  public getPid(): string | null {
    return this.pid;
  }
  public setPid(pid: string | null): void {
    this.pid = pid;
  }
}

// ------------------------------------------------------------------------------
// 2. ADMINISTRADOR DE MEMORIA (1024 KB, ASIGNACIONES Y COALESCENCIA)
// ------------------------------------------------------------------------------

export class AdministradorMemoria {
  private tamano_total: number;
  private bloques: BloqueMemoria[];

  constructor(tamano_total: number = 1024) {
    this.tamano_total = tamano_total;
    this.bloques = [new BloqueMemoria(0, tamano_total, true, null)];
  }

  // Getters y Setters
  public getTamanoTotal(): number {
    return this.tamano_total;
  }
  public setTamanoTotal(tamano: number): void {
    this.tamano_total = tamano;
  }

  public getBloques(): BloqueMemoria[] {
    return this.bloques;
  }
  public setBloques(bloques: BloqueMemoria[]): void {
    this.bloques = bloques;
  }

  /**
   * Recorre la lista de particiones y fusiona bloques libres contiguos en uno solo.
   */
  public coalescencia(): void {
    let i = 0;
    while (i < this.bloques.length - 1) {
      const actual = this.bloques[i];
      const siguiente = this.bloques[i + 1];

      if (actual.isLibre() && siguiente.isLibre()) {
        actual.setTamano(actual.getTamano() + siguiente.getTamano());
        this.bloques.splice(i + 1, 1);
      } else {
        i++;
      }
    }
  }

  /** Busca el primer hueco libre donde quepa el proceso. */
  public asignar_first_fit(proceso: Proceso): boolean {
    for (let i = 0; i < this.bloques.length; i++) {
      const bloque = this.bloques[i];
      if (bloque.isLibre() && bloque.getTamano() >= proceso.getTamanoMemoria()) {
        this._partir_y_asignar(i, bloque, proceso);
        return true;
      }
    }
    return false;
  }

  /** Busca el bloque libre que deje el menor desperdicio de espacio residual. */
  public asignar_best_fit(proceso: Proceso): boolean {
    let mejor_idx: number | null = null;
    let menor_desperdicio = Infinity;

    for (let i = 0; i < this.bloques.length; i++) {
      const b = this.bloques[i];
      if (b.isLibre() && b.getTamano() >= proceso.getTamanoMemoria()) {
        const desperdicio = b.getTamano() - proceso.getTamanoMemoria();
        if (desperdicio < menor_desperdicio) {
          menor_desperdicio = desperdicio;
          mejor_idx = i;
        }
      }
    }

    if (mejor_idx !== null) {
      this._partir_y_asignar(mejor_idx, this.bloques[mejor_idx], proceso);
      return true;
    }
    return false;
  }