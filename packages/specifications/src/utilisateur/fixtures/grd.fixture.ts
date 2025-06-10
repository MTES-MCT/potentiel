import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface GRD extends Utilisateur<'grd'> {}

export class GRDFixture extends AbstractUtilisateur<'grd'> implements GRD, Fixture<GRD> {}
