import { PorteurFixture } from './fixtures/porteur.fixture';
import { ValidateurFixture } from './fixtures/validateur.fixture';
import { DGECFixture } from './fixtures/dgec.fixture';
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

  #dgecFixture: DGECFixture;

  get dgecFixture() {
    return this.#dgecFixture;
  }

  #drealFixture: DREALFixture;

  get drealFixture() {
    return this.#drealFixture;
  }

  constructor() {
    this.#porteurFixture = new PorteurFixture();
    this.#validateurFixture = new ValidateurFixture();
    this.#dgecFixture = new DGECFixture();
    this.#drealFixture = new DREALFixture();
  }
}
