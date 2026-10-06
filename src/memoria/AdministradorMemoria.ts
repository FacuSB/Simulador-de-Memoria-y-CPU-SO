import { BloqueMemoria } from '../modelo/BloqueMemoria';
import { Proceso } from '../modelo/Proceso';
import { SeleccionarBloque } from './SeleccionarBloque';
import { GestionarMemoria } from './GestionarMemoria';

export interface MetricasMemoria {
  ocupada: number;
  libre_total: number;
  mayor_hueco: number;
  porc_ocupacion: number;
  frag_externa: number;
}

export class AdministradorMemoria implements GestionarMemoria {
  private tamano_total: number;
  private bloques: BloqueMemoria[];
  private estrategia: SeleccionarBloque;

  constructor(tamano_total: number = 1024, estrategia: SeleccionarBloque) {
    this.tamano_total = tamano_total;
    this.bloques = [new BloqueMemoria(0, tamano_total, true, null)];
    this.estrategia = estrategia;
  }

  public getBloques(): BloqueMemoria[] {
    return this.bloques;
  }

  public coalescencia(): void {
    let i = 0;
    while (i < this.bloques.length - 1) {
      const actual = this.bloques[i];
      const siguiente = this.bloques[i + 1];

      if (actual.isLibre() && siguiente.isLibre()) {
        actual.setTamano(actual.getTamano() + siguiente.getTamano());
        this.bloques.splice(i + 1, 1);
      } else {
        i++;
      }
    }
  }

  public asignar(proceso: Proceso): boolean {
    const indice = this.estrategia.seleccionar(this.bloques, proceso);
    if (indice !== null) {
      this._partir_y_asignar(indice, this.bloques[indice], proceso);
      return true;
    }
    return false;
  }

  private _partir_y_asignar(indice: number, bloque: BloqueMemoria, proceso: Proceso): void {
    if (bloque.getTamano() > proceso.getTamanoMemoria()) {
      const sobrante = bloque.getTamano() - proceso.getTamanoMemoria();
      const nuevo_bloque_libre = new BloqueMemoria(
        bloque.getInicio() + proceso.getTamanoMemoria(),
        sobrante,
        true,
        null
      );
      bloque.setTamano(proceso.getTamanoMemoria());
      bloque.setLibre(false);
      bloque.setPid(proceso.getPid());
      this.bloques.splice(indice + 1, 0, nuevo_bloque_libre);
    } else {
      bloque.setLibre(false);
      bloque.setPid(proceso.getPid());
    }
  }

  public liberar(pid: string): boolean {
    for (const b of this.bloques) {
      if (b.getPid() === pid) {
        b.setLibre(true);
        b.setPid(null);
        this.coalescencia();
        return true;
      }
    }
    return false;
  }

  public obtener_metricas(): MetricasMemoria {
    const memoria_ocupada = this.bloques
      .filter((b) => !b.isLibre())
      .reduce((acc, b) => acc + b.getTamano(), 0);

    const memoria_libre_total = this.bloques
      .filter((b) => b.isLibre())
      .reduce((acc, b) => acc + b.getTamano(), 0);

    const huecos_libres = this.bloques
      .filter((b) => b.isLibre())
      .map((b) => b.getTamano());

    const mayor_hueco = huecos_libres.length > 0 ? Math.max(...huecos_libres) : 0;
    const porcentaje_ocupacion = (memoria_ocupada / this.tamano_total) * 100;

    let frag_externa = 0.0;
    if (memoria_libre_total > 0) {
      frag_externa = (1.0 - mayor_hueco / memoria_libre_total) * 100.0;
    }

    return {
      ocupada: memoria_ocupada,
      libre_total: memoria_libre_total,
      mayor_hueco,
      porc_ocupacion: porcentaje_ocupacion,
      frag_externa,
    };
  }

  public imprimir_mapa(): void {
    console.log('   [MAPA DE MEMORIA]');
    for (const b of this.bloques) {
      const fin = b.getInicio() + b.getTamano();
      const estado_str = !b.isLibre() ? `OCUPADO por ${b.getPid()}` : 'LIBRE';
      const inicioPad = String(b.getInicio()).padStart(4, ' ');
      const finPad = String(fin).padStart(4, ' ');
      const tamanoPad = String(b.getTamano()).padStart(4, ' ');
      console.log(`   [${inicioPad} KB - ${finPad} KB] (${tamanoPad} KB) -> ${estado_str}`);
    }
  }
}
