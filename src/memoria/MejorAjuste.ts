import { SeleccionarBloque } from './SeleccionarBloque';
import { BloqueMemoria } from '../modelo/BloqueMemoria';
import { Proceso } from '../modelo/Proceso';

export class MejorAjuste implements SeleccionarBloque {
  seleccionar(bloques: BloqueMemoria[], proceso: Proceso): number | null {
    let mejor_idx: number | null = null;
    let menor_desperdicio = Infinity;

    for (let i = 0; i < bloques.length; i++) {
      const b = bloques[i];
      if (b.isLibre() && b.getTamano() >= proceso.getTamanoMemoria()) {
        const desperdicio = b.getTamano() - proceso.getTamanoMemoria();
        if (desperdicio < menor_desperdicio) {
          menor_desperdicio = desperdicio;
          mejor_idx = i;
        }
      }
    }
    return mejor_idx;
  }
}
