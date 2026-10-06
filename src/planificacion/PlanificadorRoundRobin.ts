import { PlanificarCPU } from './PlanificarCPU';
import { Proceso } from '../modelo/Proceso';

export class PlanificadorRoundRobin implements PlanificarCPU {
  constructor(private quantum: number) {}

  public getQuantum(): number {
    return this.quantum;
  }

  public evaluarProceso(proceso: Proceso): 'TERMINADO' | 'FIN_QUANTUM' | 'CONTINUA' {
    proceso.setTiempoCpuRestante(proceso.getTiempoCpuRestante() - 1);
    proceso.setQuantumConsumido(proceso.getQuantumConsumido() + 1);

    if (proceso.getTiempoCpuRestante() <= 0) {
      return 'TERMINADO';
    }
    if (proceso.getQuantumConsumido() >= this.quantum) {
      return 'FIN_QUANTUM';
    }
    return 'CONTINUA';
  }
}
