import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

const validateurRole = 'dgec-validateur';
const validateurFonction = 'fonction du DGEC validateur';

interface Validateur extends Utilisateur {
  readonly role: typeof validateurRole;
  readonly fonction: typeof validateurFonction;
}

export class ValidateurFixture
  extends AbstractUtilisateur
  implements Validateur, Fixture<Validateur>
{
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  get role(): typeof validateurRole {
    return validateurRole;
  }

  get fonction(): typeof validateurFonction {
    return validateurFonction;
  }

  créer(partialFixture?: Partial<Readonly<Omit<Validateur, 'role>'>>>): Readonly<Validateur> {
    const utilisateur = super.créer(partialFixture);

    const porteur: Validateur = {
      role: validateurRole,
      fonction: validateurFonction,
      ...utilisateur,
    };

    this.#aÉtéCréé = true;
    return porteur;
  }
}
