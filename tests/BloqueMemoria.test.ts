import { describe, expect, it } from 'vitest';
import { BloqueMemoria } from '../src/modelo/BloqueMemoria';

describe('BloqueMemoria', () => {
  it('1. crea un bloque libre con valores por defecto', () => {
    const bloque = new BloqueMemoria(0, 100);
    expect(bloque.getInicio()).toBe(0);
    expect(bloque.getTamano()).toBe(100);
    expect(bloque.isLibre()).toBe(true);
    expect(bloque.getPid()).toBeNull();
  });
});
