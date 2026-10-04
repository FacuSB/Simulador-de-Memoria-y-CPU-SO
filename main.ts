
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

  /** Busca el bloque libre de mayor tamaño absoluto. */
  public asignar_worst_fit(proceso: Proceso): boolean {
    let peor_idx: number | null = null;
    let mayor_tamano = -1;

    for (let i = 0; i < this.bloques.length; i++) {
      const b = this.bloques[i];
      if (b.isLibre() && b.getTamano() >= proceso.getTamanoMemoria()) {
        if (b.getTamano() > mayor_tamano) {
          mayor_tamano = b.getTamano();
          peor_idx = i;
        }
      }
    }

    if (peor_idx !== null) {
      this._partir_y_asignar(peor_idx, this.bloques[peor_idx], proceso);
      return true;
    }
    return false;
  }

  /** Función interna: divide el bloque libre si sobra espacio y lo marca ocupado. */
  private _partir_y_asignar(indice: number, bloque: BloqueMemoria, proceso: Proceso): void {
    if (bloque.getTamano() > proceso.getTamanoMemoria()) {
      const sobrante = bloque.getTamano() - proceso.getTamanoMemoria();
      const nuevo_bloque_libre = new BloqueMemoria(
        bloque.getInicio() + proceso.getTamanoMemoria(),
        sobrante,
        true,
        null
      );
      bloque.setTamano(proceso.getTamanoMemoria());
      bloque.setLibre(false);
      bloque.setPid(proceso.getPid());
      this.bloques.splice(indice + 1, 0, nuevo_bloque_libre);
    } else {
      bloque.setLibre(false);
      bloque.setPid(proceso.getPid());
    }
  }

  /** Libera la memoria de un proceso y ejecuta la coalescencia automática. */
  public liberar(pid: string): boolean {
    for (const b of this.bloques) {
      if (b.getPid() === pid) {
        b.setLibre(true);
        b.setPid(null);
        this.coalescencia();
        return true;
      }
    }
    return false;
  }

  /** Calcula memoria libre, ocupada, mayor bloque contiguo y fragmentación externa. */
  public obtener_metricas(): MetricasMemoria {
    const memoria_ocupada = this.bloques
      .filter((b) => !b.isLibre())
      .reduce((acc, b) => acc + b.getTamano(), 0);

    const memoria_libre_total = this.bloques
      .filter((b) => b.isLibre())
      .reduce((acc, b) => acc + b.getTamano(), 0);

    const huecos_libres = this.bloques
      .filter((b) => b.isLibre())
      .map((b) => b.getTamano());

    const mayor_hueco = huecos_libres.length > 0 ? Math.max(...huecos_libres) : 0;
    const porcentaje_ocupacion = (memoria_ocupada / this.tamano_total) * 100;

    let frag_externa = 0.0;
    if (memoria_libre_total > 0) {
      frag_externa = (1.0 - mayor_hueco / memoria_libre_total) * 100.0;
    }

    return {
      ocupada: memoria_ocupada,
      libre_total: memoria_libre_total,
      mayor_hueco,
      porc_ocupacion: porcentaje_ocupacion,
      frag_externa,
    };
  }

  /** Muestra la tabla de bloques en consola. */
  public imprimir_mapa(): void {
    console.log('   [MAPA DE MEMORIA]');
    for (const b of this.bloques) {
      const fin = b.getInicio() + b.getTamano();
      const estado_str = !b.isLibre() ? `OCUPADO por ${b.getPid()}` : 'LIBRE';
      const inicioPad = String(b.getInicio()).padStart(4, ' ');
      const finPad = String(fin).padStart(4, ' ');
      const tamanoPad = String(b.getTamano()).padStart(4, ' ');
      console.log(`   [${inicioPad} KB - ${finPad} KB] (${tamanoPad} KB) -> ${estado_str}`);
    }
  }
}