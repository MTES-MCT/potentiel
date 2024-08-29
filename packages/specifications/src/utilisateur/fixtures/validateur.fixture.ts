import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface Validateur extends Utilisateur {
  readonly role: 'dgec-validateur';
}

export class ValidateurFixture
  extends AbstractUtilisateur
  implements Validateur, Fixture<Validateur>
{
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  get role(): 'dgec-validateur' {
    return 'dgec-validateur';
  }

  créer(partialFixture?: Partial<Readonly<Omit<Validateur, 'role>'>>>): Readonly<Validateur> {
    const utilisateur = super.créer(partialFixture);

    const porteur: Validateur = {
      role: 'dgec-validateur',
      ...utilisateur,
    };

    this.#aÉtéCréé = true;
    return porteur;
  }
}
