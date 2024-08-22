import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur.fixture';

interface Porteur extends Utilisateur {
  readonly role: 'porteur-projet';
}

export class PorteurFixture extends AbstractUtilisateur implements Porteur, Fixture<Porteur> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  get role(): 'porteur-projet' {
    return 'porteur-projet';
  }

  créer(partialFixture?: Partial<Readonly<Omit<Porteur, 'role>'>>>): Readonly<Porteur> {
    const utilisateur = super.créer(partialFixture);

    const porteur: Porteur = {
      role: 'porteur-projet',
      ...utilisateur,
    };

    this.#aÉtéCréé = true;
    return porteur;
  }
}
