import type { Fixture } from '../../fixture';
import { AbstractUtilisateur, type Utilisateur } from './utilisateur';

interface GRD extends Utilisateur<'grd'> {}

export class GRDFixture extends AbstractUtilisateur<'grd'> implements GRD, Fixture<GRD> {}
