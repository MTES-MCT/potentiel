import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface DREAL extends Utilisateur {
  readonly role: 'dreal';
  readonly région: string;
}

export class DREALFixture extends AbstractUtilisateur implements DREAL, Fixture<DREAL> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  get role(): 'dreal' {
    return 'dreal';
  }

  #région!: string;
  get région(): string {
    return this.#région;
  }

  créer(
    partialFixture: Partial<Readonly<Omit<DREAL, 'role>'>>> & { région: string },
  ): Readonly<DREAL> {
    const utilisateur = super.créer(partialFixture);

    const dreal: DREAL = {
      role: 'dreal',
      ...utilisateur,
      région: partialFixture.région,
    };

    this.#aÉtéCréé = true;
    this.#région = partialFixture.région;
    return dreal;
  }
}
