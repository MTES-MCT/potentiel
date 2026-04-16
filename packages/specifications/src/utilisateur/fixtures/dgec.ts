import { Fixture } from '../../fixture.js';

import { Utilisateur, AbstractUtilisateur } from './utilisateur.js';

interface Dgec extends Utilisateur<'dgec'> {}

export class DgecFixture extends AbstractUtilisateur<'dgec'> implements Dgec, Fixture<Dgec> {}
