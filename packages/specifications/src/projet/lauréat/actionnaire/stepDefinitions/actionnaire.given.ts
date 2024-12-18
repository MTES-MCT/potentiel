import { mediator } from 'mediateur';
import { Given as EtantDonné } from '@cucumber/cucumber';

import { Actionnaire } from '@potentiel-domain/laureat';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../potentiel.world';

import {
  accorderChangementActionnaire,
  annulerChangementActionnaire,
  demanderChangementActionnaire,
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
    await accorderChangementActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
  },
);

EtantDonné(
  "un changement d'actionnaire annulé pour le projet lauréat",
  async function (this: PotentielWorld) {
    await demanderChangementActionnaire.call(
      this,
      'lauréat',
      this.utilisateurWorld.adminFixture.email,
    );
    await annulerChangementActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
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
