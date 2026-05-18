import { Fixture } from '../../fixture.js';
import { AbstractUtilisateur, Utilisateur } from './utilisateur.js';

interface DGEC extends Utilisateur<'dgec'> {}

export class DGECFixture extends AbstractUtilisateur<'dgec'> implements DGEC, Fixture<DGEC> {}
