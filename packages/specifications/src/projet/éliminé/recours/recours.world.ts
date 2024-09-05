import { AccorderRecoursFixture } from './fixtures/accorderRecours.fixture';
import { AnnulerRecoursFixture } from './fixtures/annulerRecours.fixture';
import { RejeterRecoursFixture } from './fixtures/rejeterRecours.fixture';

export class RecoursWord {
  #accorderRecoursFixture: AccorderRecoursFixture;

  get accorderRecoursFixture() {
    return this.#accorderRecoursFixture;
  }

  #annulerRecoursFixture: AnnulerRecoursFixture;

  get annulerRecoursFixture() {
    return this.#annulerRecoursFixture;
  }

  #rejeterRecoursFixture: RejeterRecoursFixture;

  get rejeterRecoursFixture() {
    return this.#rejeterRecoursFixture;
  }

  constructor() {
    this.#accorderRecoursFixture = new AccorderRecoursFixture();
    this.#annulerRecoursFixture = new AnnulerRecoursFixture();
    this.#rejeterRecoursFixture = new RejeterRecoursFixture();
  }
}
