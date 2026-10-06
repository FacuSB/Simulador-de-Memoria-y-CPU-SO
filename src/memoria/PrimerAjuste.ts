import { SeleccionarBloque } from './SeleccionarBloque';
import { BloqueMemoria } from '../modelo/BloqueMemoria';
import { Proceso } from '../modelo/Proceso';

export class PrimerAjuste implements SeleccionarBloque {
  seleccionar(bloques: BloqueMemoria[], proceso: Proceso): number | null {
    for (let i = 0; i < bloques.length; i++) {
      const bloque = bloques[i];
      if (bloque.isLibre() && bloque.getTamano() >= proceso.getTamanoMemoria()) {
        return i;
      }
    }
    return null;
  }
}
