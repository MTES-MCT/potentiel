export class RaccordementWorld {
  #identifiantProjet!: string;

  get identifiantProjet() {
    return this.#identifiantProjet || '';
  }

  set identifiantProjet(value: string) {
    this.identifiantProjet = value;
  }
}
