import { Fixture } from '../../fixture';

import { Utilisateur, AbstractUtilisateur } from './utilisateur';

interface System extends Utilisateur {
  readonly role: 'system';
}

export class SystemFixture extends AbstractUtilisateur implements System, Fixture<System> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  get role(): 'system' {
    return 'system';
  }

  créer(): Readonly<System> {
    const utilisateur = super.créer({
      nom: 'System',
      email: 'aopv.dgec@developpement-durable.gouv.fr',
    });

    const system: System = {
      role: 'system',
      ...utilisateur,
    };

    this.#aÉtéCréé = true;
    return system;
  }
}
