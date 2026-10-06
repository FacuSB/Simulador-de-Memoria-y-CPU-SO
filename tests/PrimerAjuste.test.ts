import { describe, expect, it } from 'vitest';
import { PrimerAjuste } from '../src/memoria/PrimerAjuste';
import { BloqueMemoria } from '../src/modelo/BloqueMemoria';
import { Proceso } from '../src/modelo/Proceso';

describe('PrimerAjuste', () => {
  it('selecciona el primer bloque suficientemente grande', () => {
    const ajuste = new PrimerAjuste();
    const bloques = [
      new BloqueMemoria(0, 50, false, 'P1'),
      new BloqueMemoria(50, 100, true, null),
      new BloqueMemoria(150, 200, true, null)
    ];
    const proceso = new Proceso('P2', 80, 2);
    
    expect(ajuste.seleccionar(bloques, proceso)).toBe(1);
  });
});
