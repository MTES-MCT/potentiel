import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur.fixture';

interface DGEC extends Utilisateur {
  readonly role: 'administrateur';
}

export class DGECFixture extends AbstractUtilisateur implements DGEC, Fixture<DGEC> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  get role(): 'administrateur' {
    return 'administrateur';
  }

  créer(partialFixture?: Partial<Readonly<Omit<DGEC, 'role>'>>>): Readonly<DGEC> {
    const utilisateur = super.créer(partialFixture);

    const porteur: DGEC = {
      role: 'administrateur',
      ...utilisateur,
    };

    this.#aÉtéCréé = true;
    return porteur;
  }
}
