import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../fixture';

interface NotifierÉliminé {
  identifiantProjet: string;
}

export class NotifierÉliminéFixture
  extends AbstractFixture<NotifierÉliminé>
  implements NotifierÉliminé
{
  #identifiantProjet!: string;
  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  créer(partialData?: NotifierÉliminé | undefined): Readonly<NotifierÉliminé> {
    this.#identifiantProjet =
      partialData?.identifiantProjet ?? faker.potentiel.identifiantProjet().formatter();

    return {
      identifiantProjet: this.identifiantProjet,
    };
  }
}
