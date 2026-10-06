import { pathToFileURL } from 'node:url';

import { Proceso } from './modelo/Proceso.js';
import { Simulador } from './simulacion/Simulador.js';
import { AdministradorMemoria } from './memoria/AdministradorMemoria.js';
import { PrimerAjuste } from './memoria/PrimerAjuste.js';
import { PlanificadorRoundRobin } from './planificacion/PlanificadorRoundRobin.js';

export function main(): void {
  console.log('INICIANDO SIMULADOR DISCRETO (NUEVA ARQUITECTURA)...\n');

  // Usamos el patrón Strategy inyectando las dependencias:
  const memoria = new AdministradorMemoria(1024, new PrimerAjuste());
  const planificador = new PlanificadorRoundRobin(2);
  
  const simulador = new Simulador(memoria, planificador);

  const p1 = new Proceso('P1', 400, 4);
  const p2 = new Proceso('P2', 350, 3);
  const p3 = new Proceso('P3', 150, 2);

  for (const p of [p1, p2, p3]) {
    simulador.agregar_proceso(p);
  }

  for (let i = 0; i < 12; i++) {
    simulador.avanzar_tick();
  }
}

if (typeof process !== 'undefined' && process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
