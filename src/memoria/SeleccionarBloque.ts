import { BloqueMemoria } from '../modelo/BloqueMemoria';
import { Proceso } from '../modelo/Proceso';

export interface SeleccionarBloque {
  seleccionar(bloques: BloqueMemoria[], proceso: Proceso): number | null;
}
