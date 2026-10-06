import { describe, expect, it } from 'vitest';
import { MejorAjuste } from '../src/memoria/MejorAjuste';
import { BloqueMemoria } from '../src/modelo/BloqueMemoria';
import { Proceso } from '../src/modelo/Proceso';

describe('MejorAjuste', () => {
  it('selecciona el bloque que deje el menor desperdicio', () => {
    const ajuste = new MejorAjuste();
    const bloques = [
      new BloqueMemoria(0, 50, false, 'P1'),
      new BloqueMemoria(50, 200, true, null),
      new BloqueMemoria(250, 100, true, null)
    ];
    const proceso = new Proceso('P2', 80, 2);
    
    expect(ajuste.seleccionar(bloques, proceso)).toBe(2);
  });
});
