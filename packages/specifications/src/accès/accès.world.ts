import { RemplacerAccèsProjetFixture } from './fixtures/remplacer/remplacerAccèsProjet.fixture';
import { RéclamerProjetFixture } from './fixtures/réclamer/réclamerProjet.fixture';

export class AccèsWorld {
  #réclamerProjet: RéclamerProjetFixture;
  #remplacerAccèsProjet: RemplacerAccèsProjetFixture;

  get réclamerProjet() {
    return this.#réclamerProjet;
  }

  get remplacerAccèsProjet() {
    return this.#remplacerAccèsProjet;
  }

  constructor() {
    this.#réclamerProjet = new RéclamerProjetFixture();
    this.#remplacerAccèsProjet = new RemplacerAccèsProjetFixture();
  }
}
