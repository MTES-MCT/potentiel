import type { Fixture } from '../../fixture.js';
import { AbstractUtilisateur, type Utilisateur } from './utilisateur.js';

interface Porteur extends Utilisateur<'porteur-projet'> {}

export class PorteurFixture
  extends AbstractUtilisateur<'porteur-projet'>
  implements Porteur, Fixture<Porteur> {}
