import { describe, expect, it } from 'vitest';
import { AdministradorMemoria } from '../src/memoria/AdministradorMemoria';
import { PrimerAjuste } from '../src/memoria/PrimerAjuste';
import { Proceso } from '../src/modelo/Proceso';

describe('AdministradorMemoria', () => {
  it('asigna y fusiona bloques', () => {
    const memoria = new AdministradorMemoria(100, new PrimerAjuste());
    const p1 = new Proceso('P1', 20, 2);
    const p2 = new Proceso('P2', 20, 2);

    memoria.asignar(p1);
    memoria.asignar(p2);
    memoria.liberar('P1');
    memoria.liberar('P2');

    expect(memoria.getBloques()).toHaveLength(1);
    expect(memoria.getBloques()[0].isLibre()).toBe(true);
    expect(memoria.getBloques()[0].getTamano()).toBe(100);
  });
});
