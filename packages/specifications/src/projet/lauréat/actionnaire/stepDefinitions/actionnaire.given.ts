import { mediator } from 'mediateur';
import { Given as EtantDonné } from '@cucumber/cucumber';

import { Actionnaire } from '@potentiel-domain/laureat';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../potentiel.world';

import {
  accorderDemandeChangementActionnaire,
  annulerDemandeChangementActionnaire,
  demanderChangementActionnaire,
  rejeterDemandeChangementActionnaire,
} from './actionnaire.when';

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
    await accorderDemandeChangementActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
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
    await annulerDemandeChangementActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
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
    await rejeterDemandeChangementActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
  },
);

export async function importerActionnaire(this: PotentielWorld) {
  const identifiantProjet = this.candidatureWorld.importerCandidature.identifiantProjet;
  const { importéLe } = this.lauréatWorld.actionnaireWorld.importerActionnaireFixture.créer();

  await mediator.send<Actionnaire.ActionnaireCommand>({
    type: 'Lauréat.Actionnaire.Command.ImporterActionnaire',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéLe: DateTime.convertirEnValueType(importéLe),
    },
  });
}
