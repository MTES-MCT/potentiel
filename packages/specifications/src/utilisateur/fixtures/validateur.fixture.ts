import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface Validateur extends Utilisateur<'dgec-validateur'> {}

export class ValidateurFixture
  extends AbstractUtilisateur<'dgec-validateur'>
  implements Validateur, Fixture<Validateur>
{
  get fonction(): string {
    return 'fonction du DGEC validateur';
  }
}
