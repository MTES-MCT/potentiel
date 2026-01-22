import { Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../potentiel.world.js';

import {
  accorderChangementActionnaire,
  annulerChangementActionnaire,
  demanderChangementActionnaire,
  rejeterChangementActionnaire,
} from './actionnaire.when.js';

EtantDonné(
  "une demande de changement d'actionnaire en cours pour le projet lauréat",
  async function (this: PotentielWorld) {
    await demanderChangementActionnaire.call(
      this,
      'lauréat',
      this.utilisateurWorld.adminFixture.email,
    );
  },
);

EtantDonné(
  "une demande de changement d'actionnaire accordée pour le projet lauréat",
  async function (this: PotentielWorld) {
    await demanderChangementActionnaire.call(
      this,
      'lauréat',
      this.utilisateurWorld.adminFixture.email,
    );
    await accorderChangementActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
  },
);

EtantDonné(
  "une demande de changement d'actionnaire annulée pour le projet lauréat",
  async function (this: PotentielWorld) {
    await demanderChangementActionnaire.call(
      this,
      'lauréat',
      this.utilisateurWorld.adminFixture.email,
    );
    await annulerChangementActionnaire.call(this);
  },
);

EtantDonné(
  "une demande de changement d'actionnaire rejetée pour le projet lauréat",
  async function (this: PotentielWorld) {
    await demanderChangementActionnaire.call(
      this,
      'lauréat',
      this.utilisateurWorld.adminFixture.email,
    );
    await rejeterChangementActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
  },
);
