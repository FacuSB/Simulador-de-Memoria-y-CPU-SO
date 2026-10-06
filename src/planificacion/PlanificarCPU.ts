import { Proceso } from '../modelo/Proceso';

export interface PlanificarCPU {
  getQuantum(): number;
  evaluarProceso(proceso: Proceso): 'TERMINADO' | 'FIN_QUANTUM' | 'CONTINUA';
}
