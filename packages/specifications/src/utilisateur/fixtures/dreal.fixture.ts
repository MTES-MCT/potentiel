import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface DREAL extends Utilisateur {
  readonly role: 'dreal';
}

export class DREALFixture extends AbstractUtilisateur implements DREAL, Fixture<DREAL> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  get role(): 'dreal' {
    return 'dreal';
  }

  créer(partialFixture?: Partial<Readonly<Omit<DREAL, 'role>'>>>): Readonly<DREAL> {
    const utilisateur = super.créer(partialFixture);

    const dreal: DREAL = {
      role: 'dreal',
      ...utilisateur,
    };

    this.#aÉtéCréé = true;
    return dreal;
  }
}
