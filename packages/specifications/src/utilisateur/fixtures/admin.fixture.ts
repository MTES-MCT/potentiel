import { Fixture } from '../../fixture.js';

import { Utilisateur, AbstractUtilisateur } from './utilisateur.js';

interface Admin extends Utilisateur<'admin'> {}

export class AdminFixture extends AbstractUtilisateur<'admin'> implements Admin, Fixture<Admin> {}
