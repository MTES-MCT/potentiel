import { Fixture } from '../../fixture.js';

import { Utilisateur, AbstractUtilisateur } from './utilisateur.js';

const validateurFonction: string = 'fonction du DGEC validateur';

interface Validateur extends Utilisateur<'dgec-validateur'> {
  readonly fonction: typeof validateurFonction;
}

export class ValidateurFixture
  extends AbstractUtilisateur<'dgec-validateur'>
  implements Validateur, Fixture<Validateur>
{
  #fonction!: string;
  get fonction(): string {
    return this.#fonction;
  }

  créer(partialFixture?: Partial<Readonly<Omit<Validateur, 'role>'>>>): Readonly<Validateur> {
    const utilisateur = super.créer(partialFixture);

    const porteur: Validateur = {
      fonction: validateurFonction,
      ...partialFixture,
      ...utilisateur,
    };
    this.#fonction = porteur.fonction;

    return porteur;
  }
}
