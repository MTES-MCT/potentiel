import { Fixture } from '../../fixture.js';

import { Utilisateur, AbstractUtilisateur } from './utilisateur.js';

interface Porteur extends Utilisateur<'porteur-projet'> {}

export class PorteurFixture
  extends AbstractUtilisateur<'porteur-projet'>
  implements Porteur, Fixture<Porteur> {}
