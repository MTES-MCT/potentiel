import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface Porteur extends Utilisateur<'porteur-projet'> {}

export class PorteurFixture
  extends AbstractUtilisateur<'porteur-projet'>
  implements Porteur, Fixture<Porteur> {}
