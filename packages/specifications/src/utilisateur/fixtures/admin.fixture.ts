import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface Admin extends Utilisateur<'admin'> {}

export class AdminFixture extends AbstractUtilisateur<'admin'> implements Admin, Fixture<Admin> {}
