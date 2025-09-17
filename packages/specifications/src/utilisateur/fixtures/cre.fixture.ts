import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface CRE extends Utilisateur<'cre'> {}

export class CREFixture extends AbstractUtilisateur<'cre'> implements CRE, Fixture<CRE> {}
