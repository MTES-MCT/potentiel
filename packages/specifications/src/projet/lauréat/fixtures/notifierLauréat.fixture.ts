import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../fixture';

interface NotifierLauréat {
  identifiantProjet: string;
}

export class NotifierLauréatFixture
  extends AbstractFixture<NotifierLauréat>
  implements NotifierLauréat
{
  #identifiantProjet!: string;
  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  créer(partialData?: NotifierLauréat | undefined): Readonly<NotifierLauréat> {
    this.#identifiantProjet = partialData?.identifiantProjet ?? faker.potentiel.identifiantProjet();

    return {
      identifiantProjet: this.identifiantProjet,
    };
  }
}
