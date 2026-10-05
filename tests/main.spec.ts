import { describe, expect, it } from 'vitest';

import { AdministradorMemoria, BloqueMemoria, Proceso, SimuladorSO } from '../main';

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

describe('BloqueMemoria', () => {
  it('6. crea un bloque libre con valores por defecto', () => {
    const bloque = new BloqueMemoria(0, 100);

    expect(bloque.getInicio()).toBe(0);
    expect(bloque.getTamano()).toBe(100);
    expect(bloque.isLibre()).toBe(true);
    expect(bloque.getPid()).toBeNull();
  });

  it('7. actualiza inicio, tamaño, estado y pid', () => {
    const bloque = new BloqueMemoria(10, 20, true, null);

    bloque.setInicio(25);
    bloque.setTamano(35);
    bloque.setLibre(false);
    bloque.setPid('P9');

    expect(bloque.getInicio()).toBe(25);
    expect(bloque.getTamano()).toBe(35);
    expect(bloque.isLibre()).toBe(false);
    expect(bloque.getPid()).toBe('P9');
  });

  it('8. puede reutilizarse como bloque ocupado', () => {
    const bloque = new BloqueMemoria(50, 10, false, 'P4');

    expect(bloque.isLibre()).toBe(false);
    expect(bloque.getPid()).toBe('P4');
  });
});

describe('AdministradorMemoria', () => {
  it('9. asigna memoria con First Fit en el primer hueco disponible', () => {
    const memoria = new AdministradorMemoria(100);
    const p1 = new Proceso('P1', 30, 2);
    const p2 = new Proceso('P2', 25, 2);

    expect(memoria.asignar_first_fit(p1)).toBe(true);
    expect(memoria.asignar_first_fit(p2)).toBe(true);
    expect(memoria.getBloques()[0].getPid()).toBe('P1');
    expect(memoria.getBloques()[1].getPid()).toBe('P2');
  });

  it('10. asigna con Best Fit usando el hueco con menor desperdicio', () => {
    const memoria = new AdministradorMemoria(100);
    const p1 = new Proceso('P1', 40, 2);
    const p2 = new Proceso('P2', 20, 2);
    const p3 = new Proceso('P3', 25, 2);

    expect(memoria.asignar_first_fit(p1)).toBe(true);
    expect(memoria.asignar_first_fit(p2)).toBe(true);
    expect(memoria.asignar_best_fit(p3)).toBe(true);

    const bloques = memoria.getBloques();
    expect(bloques[2].getPid()).toBe('P3');
    expect(bloques[2].getTamano()).toBe(25);
  });

  it('11. asigna con Worst Fit usando el hueco más grande', () => {
    const memoria = new AdministradorMemoria(100);
    const p1 = new Proceso('P1', 20, 2);
    const p2 = new Proceso('P2', 30, 2);
    const p3 = new Proceso('P3', 25, 2);

    expect(memoria.asignar_worst_fit(p1)).toBe(true);
    expect(memoria.asignar_worst_fit(p2)).toBe(true);
    expect(memoria.asignar_worst_fit(p3)).toBe(true);

    const bloques = memoria.getBloques();
    expect(bloques.some((b) => b.getPid() === 'P3')).toBe(true);
  });

  it('12. devuelve false al intentar liberar un pid inexistente', () => {
    const memoria = new AdministradorMemoria(100);

    expect(memoria.liberar('NO_EXISTE')).toBe(false);
  });

  it('13. fusiona bloques libres contiguos con coalescencia', () => {
    const memoria = new AdministradorMemoria(100);
    const p1 = new Proceso('P1', 20, 2);
    const p2 = new Proceso('P2', 20, 2);

    memoria.asignar_first_fit(p1);
    memoria.asignar_first_fit(p2);
    memoria.liberar('P1');
    memoria.liberar('P2');

    expect(memoria.getBloques()).toHaveLength(1);
    expect(memoria.getBloques()[0].isLibre()).toBe(true);
    expect(memoria.getBloques()[0].getTamano()).toBe(100);
  });

  it('14. calcula correctamente las métricas de uso y fragmentación', () => {
    const memoria = new AdministradorMemoria(100);
    const p1 = new Proceso('P1', 30, 2);
    const p2 = new Proceso('P2', 40, 2);

    memoria.asignar_first_fit(p1);
    memoria.asignar_first_fit(p2);

    const metricas = memoria.obtener_metricas();
    expect(metricas.ocupada).toBe(70);
    expect(metricas.libre_total).toBe(30);
    expect(metricas.mayor_hueco).toBe(30);
    expect(metricas.porc_ocupacion).toBe(70);
    expect(metricas.frag_externa).toBe(0);
  });

  it('15. imprime el mapa sin lanzar errores', () => {
    const memoria = new AdministradorMemoria(100);
    const proceso = new Proceso('P1', 30, 2);

    memoria.asignar_first_fit(proceso);
    expect(() => memoria.imprimir_mapa()).not.toThrow();
  });
});

describe('SimuladorSO', () => {
  it('16. agrega procesos nuevos a la cola correspondiente', () => {
    const simulador = new SimuladorSO('FIRST_FIT', 2);
    const proceso = new Proceso('P1', 50, 3);

    simulador.agregar_proceso(proceso);

    expect(simulador.getColaNuevos()).toHaveLength(1);
    expect(simulador.getColaNuevos()[0].getPid()).toBe('P1');
    expect(proceso.getEstado()).toBe('NUEVO');
  });

  it('17. intenta asignar memoria usando el algoritmo configurado', () => {
    const simulador = new SimuladorSO('BEST_FIT', 2);
    const proceso = new Proceso('P1', 25, 3);

    expect(simulador.intentar_asignar_memoria(proceso)).toBe(true);
    expect(simulador.getMemoria().getBloques().some((b) => b.getPid() === 'P1' && !b.isLibre())).toBe(true);
  });

  it('18. bloquea el proceso actual y lo mueve a la cola de bloqueo', () => {
    const simulador = new SimuladorSO('FIRST_FIT', 2);
    const proceso = new Proceso('P1', 20, 3);

    simulador.setCpuProceso(proceso);
    simulador.bloquear_proceso_actual(3);

    expect(simulador.getCpuProceso()).toBeNull();
    expect(simulador.getColaBloqueados()).toHaveLength(1);
    expect(simulador.getColaBloqueados()[0].getEstado()).toBe('BLOQUEADO');
  });

  it('19. avanza un tick y pone el proceso en ejecución si alcanza memoria', () => {
    const simulador = new SimuladorSO('FIRST_FIT', 2);
    const proceso = new Proceso('P1', 50, 4);

    simulador.agregar_proceso(proceso);
    simulador.avanzar_tick();

    expect(simulador.getRelojTick()).toBe(1);
    expect(simulador.getCpuProceso()?.getPid()).toBe('P1');
    expect(simulador.getColaEsperandoMemoria()).toHaveLength(0);
    expect(simulador.getColaListos()).toHaveLength(0);
  });

  it('20. finaliza un proceso cuando el CPU restante llega a cero', () => {
    const simulador = new SimuladorSO('FIRST_FIT', 2);
    const proceso = new Proceso('P1', 50, 1);

    simulador.agregar_proceso(proceso);
    simulador.avanzar_tick();

    expect(simulador.getCpuProceso()).toBeNull();
    expect(simulador.getProcesosTerminados()).toHaveLength(1);
    expect(simulador.getProcesosTerminados()[0].getEstado()).toBe('TERMINADO');
    expect(simulador.getMemoria().obtener_metricas().ocupada).toBe(0);
  });
});
