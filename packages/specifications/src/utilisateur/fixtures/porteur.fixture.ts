import type { Fixture } from '../../fixture';
import { AbstractUtilisateur, type Utilisateur } from './utilisateur';

interface Porteur extends Utilisateur<'porteur-projet'> {}

export class PorteurFixture
  extends AbstractUtilisateur<'porteur-projet'>
  implements Porteur, Fixture<Porteur> {}
