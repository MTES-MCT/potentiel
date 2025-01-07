import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

const validateurRole = 'dgec-validateur';
const validateurFonction: string = 'fonction du DGEC validateur';

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

  #fonction!: string;
  get fonction(): string {
    return this.#fonction;
  }

  créer(partialFixture?: Partial<Readonly<Omit<Validateur, 'role>'>>>): Readonly<Validateur> {
    const utilisateur = super.créer(partialFixture);

    const porteur: Validateur = {
      role: validateurRole,
      fonction: validateurFonction,
      ...partialFixture,
      ...utilisateur,
    };
    this.#fonction = porteur.fonction;

    this.#aÉtéCréé = true;
    return porteur;
  }
}
