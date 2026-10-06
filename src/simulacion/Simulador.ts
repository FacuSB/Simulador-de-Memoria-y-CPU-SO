import { Proceso } from '../modelo/Proceso';
import { AdministradorMemoria } from '../memoria/AdministradorMemoria';
import { PrimerAjuste } from '../memoria/PrimerAjuste';
import { PlanificadorRoundRobin } from '../planificacion/PlanificadorRoundRobin';
import { PlanificarCPU } from '../planificacion/PlanificarCPU';

export class Simulador {
  private memoria: AdministradorMemoria;
  private planificador: PlanificarCPU;

  private cola_nuevos: Proceso[] = [];
  private cola_esperando_memoria: Proceso[] = [];
  private cola_listos: Proceso[] = [];
  private cola_bloqueados: Proceso[] = [];
  private procesos_terminados: Proceso[] = [];

  private cpu_proceso: Proceso | null = null;
  private reloj_tick: number = 0;
  private cambios_contexto: number = 0;
  private ticks_cpu_ocupada: number = 0;

  constructor(
    memoria: AdministradorMemoria = new AdministradorMemoria(1024, new PrimerAjuste()),
    planificador: PlanificarCPU = new PlanificadorRoundRobin(2)
  ) {
    this.memoria = memoria;
    this.planificador = planificador;
  }

  public getMemoria(): AdministradorMemoria { return this.memoria; }
  public getColaNuevos(): Proceso[] { return this.cola_nuevos; }
  public getColaEsperandoMemoria(): Proceso[] { return this.cola_esperando_memoria; }
  public getColaListos(): Proceso[] { return this.cola_listos; }
  public getColaBloqueados(): Proceso[] { return this.cola_bloqueados; }
  public getProcesosTerminados(): Proceso[] { return this.procesos_terminados; }
  public getCpuProceso(): Proceso | null { return this.cpu_proceso; }
  public setCpuProceso(proceso: Proceso | null): void { this.cpu_proceso = proceso; }
  public getRelojTick(): number { return this.reloj_tick; }

  public agregar_proceso(proceso: Proceso): void {
    proceso.setEstado('NUEVO');
    this.cola_nuevos.push(proceso);
  }

  public bloquear_proceso_actual(ticks_bloqueo: number = 2): void {
    if (this.cpu_proceso !== null) {
      const p = this.cpu_proceso;
      p.setEstado('BLOQUEADO');
      p.setTiempoBloqueoRestante(ticks_bloqueo);
      this.cola_bloqueados.push(p);
      console.log(`   [E/S] Proceso ${p.getPid()} se bloquea por ${ticks_bloqueo} ticks.`);
      this.cpu_proceso = null;
      this.cambios_contexto += 1;
    }
  }

  public avanzar_tick(): void {
    this.reloj_tick += 1;
    console.log(`\n${'='.repeat(25)} TICK ${this.reloj_tick} ${'='.repeat(25)}`);

    while (this.cola_nuevos.length > 0) {
      const p = this.cola_nuevos.shift()!;
      p.setEstado('ESPERANDO_MEMORIA');
      this.cola_esperando_memoria.push(p);
    }

    let i = 0;
    while (i < this.cola_esperando_memoria.length) {
      const p = this.cola_esperando_memoria[i];
      if (this.memoria.asignar(p)) {
        p.setEstado('LISTO');
        this.cola_listos.push(p);
        this.cola_esperando_memoria.splice(i, 1);
        console.log(`   [MEMORIA] Proceso ${p.getPid()} obtuvo memoria. Pasa a LISTO.`);
      } else {
        i++;
      }
    }

    let j = 0;
    while (j < this.cola_bloqueados.length) {
      const p = this.cola_bloqueados[j];
      p.setTiempoBloqueoRestante(p.getTiempoBloqueoRestante() - 1);
      if (p.getTiempoBloqueoRestante() <= 0) {
        p.setEstado('LISTO');
        this.cola_listos.push(p);
        this.cola_bloqueados.splice(j, 1);
        console.log(`   [E/S COMPLETADA] Proceso ${p.getPid()} vuelve a cola de LISTOS.`);
      } else {
        j++;
      }
    }

    if (this.cpu_proceso === null && this.cola_listos.length > 0) {
      this.cpu_proceso = this.cola_listos.shift()!;
      this.cpu_proceso.setEstado('EJECUTANDO');
      this.cpu_proceso.setQuantumConsumido(0);
      console.log(`   [CPU] El proceso ${this.cpu_proceso.getPid()} toma el procesador.`);
    }

    if (this.cpu_proceso !== null) {
      this.ticks_cpu_ocupada += 1;
      const p = this.cpu_proceso;
      const resultado = this.planificador.evaluarProceso(p);

      console.log(`   [EJECUTANDO] PID: ${p.getPid()} | Restante: ${p.getTiempoCpuRestante()} ticks | Quantum: ${p.getQuantumConsumido()}/${this.planificador.getQuantum()}`);

      if (resultado === 'TERMINADO') {
        p.setEstado('TERMINADO');
        console.log(`   [FINALIZADO] Proceso ${p.getPid()} finalizó. Libera memoria y CPU.`);
        this.memoria.liberar(p.getPid());
        this.procesos_terminados.push(p);
        this.cpu_proceso = null;
      } else if (resultado === 'FIN_QUANTUM') {
        if (this.cola_listos.length > 0) {
          console.log(`   [FIN QUANTUM] ${p.getPid()} agotó Quantum. Vuelve al final de LISTOS.`);
          p.setEstado('LISTO');
          p.setQuantumConsumido(0);
          this.cola_listos.push(p);
          this.cpu_proceso = null;
          this.cambios_contexto += 1;
        } else {
          console.log(`   [RENOVACIÓN] ${p.getPid()} continúa en CPU (cola de Listos vacía).`);
          p.setQuantumConsumido(0);
        }
      }
    } else {
      console.log('   [CPU OCIOSA] Ningún proceso listo para ejecutar.');
    }

    const m = this.memoria.obtener_metricas();
    const uso_cpu = (this.ticks_cpu_ocupada / this.reloj_tick) * 100;

    console.log('\n   --- MÉTRICAS EN TIEMPO REAL ---');
    console.log(`   Uso de CPU Acumulado: ${uso_cpu.toFixed(2)}% | Cambios de Contexto: ${this.cambios_contexto}`);
    console.log(`   Memoria Ocupada: ${m.ocupada} KB (${m.porc_ocupacion.toFixed(1)}%) | Libre Total: ${m.libre_total} KB`);
    console.log(`   Mayor Hueco Contiguo: ${m.mayor_hueco} KB | Fragmentación Externa: ${m.frag_externa.toFixed(2)}%`);
    console.log(`   Cola de Listos: [${this.cola_listos.map((proc) => proc.getPid()).join(', ')}]`);
    console.log(`   Esperando Memoria: [${this.cola_esperando_memoria.map((proc) => proc.getPid()).join(', ')}]`);
    this.memoria.imprimir_mapa();
  }
}
