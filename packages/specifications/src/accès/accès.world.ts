import { RéclamerProjetFixture } from './fixtures/réclamer/réclamerProjet.fixture';

export class AccèsWorld {
  #réclamerProjet: RéclamerProjetFixture;

  get réclamerProjet() {
    return this.#réclamerProjet;
  }

  constructor() {
    this.#réclamerProjet = new RéclamerProjetFixture();
  }
}
