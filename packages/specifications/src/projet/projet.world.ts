export class ProjetWorld {
  #identifiantProjet: {
    appelOffre: string;
    période: string;
    numéroCRE: string;
  };

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  constructor() {
    this.#identifiantProjet = {
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      numéroCRE: '23',
    };
  }
}
