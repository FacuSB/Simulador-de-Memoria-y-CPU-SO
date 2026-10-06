export class BloqueMemoria {
  private inicio: number;
  private tamano: number;
  private libre: boolean;
  private pid: string | null;

  constructor(inicio: number, tamano: number, libre: boolean = true, pid: string | null = null) {
    this.inicio = inicio;
    this.tamano = tamano;
    this.libre = libre;
    this.pid = pid;
  }

  public getInicio(): number { return this.inicio; }
  public setInicio(inicio: number): void { this.inicio = inicio; }
  public getTamano(): number { return this.tamano; }
  public setTamano(tamano: number): void { this.tamano = tamano; }
  public isLibre(): boolean { return this.libre; }
  public setLibre(libre: boolean): void { this.libre = libre; }
  public getPid(): string | null { return this.pid; }
  public setPid(pid: string | null): void { this.pid = pid; }
}
