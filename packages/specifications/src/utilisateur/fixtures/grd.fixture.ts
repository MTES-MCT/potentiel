import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface GRD extends Utilisateur {
  readonly role: 'grd';
}

export class GRDFixture extends AbstractUtilisateur implements GRD, Fixture<GRD> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  get role(): 'grd' {
    return 'grd';
  }

  créer(partialFixture?: Partial<Readonly<Omit<GRD, 'role>'>>>): Readonly<GRD> {
    const utilisateur = super.créer(partialFixture);

    const GRD: GRD = {
      role: 'grd',
      ...utilisateur,
    };

    this.#aÉtéCréé = true;
    return GRD;
  }
}
