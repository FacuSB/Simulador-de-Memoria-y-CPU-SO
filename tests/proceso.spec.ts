import { describe, expect, it } from 'vitest';

import { Proceso } from '../src/main';

describe('Proceso', () => {
  it('1. crea un proceso con valores iniciales correctos', () => {
    const proceso = new Proceso('P1', 128, 10);

    expect(proceso.getPid()).toBe('P1');
    expect(proceso.getTamanoMemoria()).toBe(128);
    expect(proceso.getTiempoCpuTotal()).toBe(10);
    expect(proceso.getTiempoCpuRestante()).toBe(10);
    expect(proceso.getEstado()).toBe('NUEVO');
    expect(proceso.getQuantumConsumido()).toBe(0);
    expect(proceso.getTiempoBloqueoRestante()).toBe(0);
  });

  it('2. permite actualizar el pid y el tamaño de memoria', () => {
    const proceso = new Proceso('P1', 64, 5);

    proceso.setPid('P2');
    proceso.setTamanoMemoria(96);

    expect(proceso.getPid()).toBe('P2');
    expect(proceso.getTamanoMemoria()).toBe(96);
  });

  it('3. permite actualizar el tiempo total de CPU', () => {
    const proceso = new Proceso('P1', 32, 3);

    proceso.setTiempoCpuTotal(8);
    proceso.setTiempoCpuRestante(6);

    expect(proceso.getTiempoCpuTotal()).toBe(8);
    expect(proceso.getTiempoCpuRestante()).toBe(6);
  });

  it('4. cambia de estado correctamente', () => {
    const proceso = new Proceso('P1', 16, 2);

    proceso.setEstado('LISTO');
    expect(proceso.getEstado()).toBe('LISTO');

    proceso.setEstado('EJECUTANDO');
    expect(proceso.getEstado()).toBe('EJECUTANDO');
  });

  it('5. guarda el quantum y el bloqueo restante', () => {
    const proceso = new Proceso('P1', 24, 4);

    proceso.setQuantumConsumido(2);
    proceso.setTiempoBloqueoRestante(5);

    expect(proceso.getQuantumConsumido()).toBe(2);
    expect(proceso.getTiempoBloqueoRestante()).toBe(5);
  });
});
