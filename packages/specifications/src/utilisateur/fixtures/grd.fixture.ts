import { Fixture } from '../../fixture.js';
import { AbstractUtilisateur, Utilisateur } from './utilisateur.js';

interface GRD extends Utilisateur<'grd'> {}

export class GRDFixture extends AbstractUtilisateur<'grd'> implements GRD, Fixture<GRD> {}
