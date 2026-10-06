import { describe, expect, it } from 'vitest';
import { Simulador } from '../src/simulacion/Simulador';
import { Proceso } from '../src/modelo/Proceso';

describe('Simulador', () => {
  it('agrega procesos y simula un tick', () => {
    const simulador = new Simulador();
    const proceso = new Proceso('P1', 50, 3);
    simulador.agregar_proceso(proceso);
    simulador.avanzar_tick();
    
    expect(simulador.getRelojTick()).toBe(1);
    expect(simulador.getCpuProceso()?.getPid()).toBe('P1');
  });
});
