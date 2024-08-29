import { PorteurFixture } from './fixtures/porteur.fixture';
import { ValidateurFixture } from './fixtures/validateur.fixture';
import { DREALFixture } from './fixtures/dreal.fixture';

export class UtilisateurWorld {
  #porteurFixture: PorteurFixture;

  get porteurFixture() {
    return this.#porteurFixture;
  }

  #validateurFixture: ValidateurFixture;

  get validateurFixture() {
    return this.#validateurFixture;
  }

  #drealFixture: DREALFixture;

  get drealFixture() {
    return this.#drealFixture;
  }

  constructor() {
    this.#porteurFixture = new PorteurFixture();
    this.#validateurFixture = new ValidateurFixture();
    this.#drealFixture = new DREALFixture();
  }
}
