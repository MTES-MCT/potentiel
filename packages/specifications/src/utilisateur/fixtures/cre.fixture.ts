import type { Fixture } from '../../fixture.js';
import { AbstractUtilisateur, type Utilisateur } from './utilisateur.js';

interface CRE extends Utilisateur<'cre'> {}

export class CREFixture extends AbstractUtilisateur<'cre'> implements CRE, Fixture<CRE> {}
