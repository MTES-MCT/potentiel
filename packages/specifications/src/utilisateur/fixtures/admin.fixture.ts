import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface Admin extends Utilisateur {
  readonly role: 'admin';
}

export class AdminFixture extends AbstractUtilisateur implements Admin, Fixture<Admin> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  get role(): 'admin' {
    return 'admin';
  }

  créer(partialFixture?: Partial<Readonly<Omit<Admin, 'role>'>>>): Readonly<Admin> {
    const utilisateur = super.créer(partialFixture);

    const admin: Admin = {
      role: 'admin',
      ...utilisateur,
    };

    this.#aÉtéCréé = true;
    return admin;
  }
}
