import { Fixture } from '../../fixture.js';

import { Utilisateur, AbstractUtilisateur } from './utilisateur.js';

interface CRE extends Utilisateur<'cre'> {}

export class CREFixture extends AbstractUtilisateur<'cre'> implements CRE, Fixture<CRE> {}
