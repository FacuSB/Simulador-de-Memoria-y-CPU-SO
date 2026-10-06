import { describe, expect, it } from 'vitest';
import { Proceso } from '../src/modelo/Proceso';

describe('Proceso', () => {
  it('1. crea un proceso con valores iniciales correctos', () => {
    const proceso = new Proceso('P1', 128, 10);
    expect(proceso.getPid()).toBe('P1');
    expect(proceso.getTamanoMemoria()).toBe(128);
    expect(proceso.getTiempoCpuTotal()).toBe(10);
    expect(proceso.getTiempoCpuRestante()).toBe(10);
    expect(proceso.getEstado()).toBe('NUEVO');
  });

  it('2. cambia de estado correctamente', () => {
    const proceso = new Proceso('P1', 16, 2);
    proceso.setEstado('LISTO');
    expect(proceso.getEstado()).toBe('LISTO');
  });
});
