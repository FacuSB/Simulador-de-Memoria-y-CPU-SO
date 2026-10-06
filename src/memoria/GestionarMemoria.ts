import { Proceso } from '../modelo/Proceso';
import { MetricasMemoria } from './AdministradorMemoria';

export interface GestionarMemoria {
  asignar(proceso: Proceso): boolean;
  liberar(pid: string): boolean;
  obtener_metricas(): MetricasMemoria;
  imprimir_mapa(): void;
}
