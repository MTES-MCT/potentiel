import { Fixture } from '../../fixture.js';

import { Utilisateur, AbstractUtilisateur } from './utilisateur.js';

interface DREAL extends Utilisateur<'dreal'> {
  readonly région: string;
}

export class DREALFixture extends AbstractUtilisateur<'dreal'> implements DREAL, Fixture<DREAL> {
  #région!: string;
  get région(): string {
    return this.#région;
  }

  créer(
    partialFixture: Partial<Readonly<Omit<DREAL, 'role>'>>> & { région: string },
  ): Readonly<DREAL> {
    const utilisateur = super.créer(partialFixture);

    const dreal: DREAL = {
      ...utilisateur,
      région: partialFixture.région,
    };

    this.#région = partialFixture.région;
    return dreal;
  }
}
