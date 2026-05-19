import type { Fixture } from '../../fixture.js';
import { AbstractUtilisateur, type Utilisateur } from './utilisateur.js';

interface GRD extends Utilisateur<'grd'> {}

export class GRDFixture extends AbstractUtilisateur<'grd'> implements GRD, Fixture<GRD> {}
