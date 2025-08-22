import type { Fixture } from '../../fixture';
import { AbstractUtilisateur, type Utilisateur } from './utilisateur';

interface Admin extends Utilisateur<'admin'> {}

export class AdminFixture extends AbstractUtilisateur<'admin'> implements Admin, Fixture<Admin> {}
