import { describe, expect, it } from 'vitest';
import { PlanificadorRoundRobin } from '../src/planificacion/PlanificadorRoundRobin';
import { Proceso } from '../src/modelo/Proceso';

describe('PlanificadorRoundRobin', () => {
  it('evalua FIN_QUANTUM y TERMINADO', () => {
    const rr = new PlanificadorRoundRobin(2);
    const p = new Proceso('P1', 10, 3);
    
    expect(rr.evaluarProceso(p)).toBe('CONTINUA');
    expect(rr.evaluarProceso(p)).toBe('FIN_QUANTUM');
    p.setQuantumConsumido(0); // simular reinicio
    expect(rr.evaluarProceso(p)).toBe('TERMINADO');
  });
});
