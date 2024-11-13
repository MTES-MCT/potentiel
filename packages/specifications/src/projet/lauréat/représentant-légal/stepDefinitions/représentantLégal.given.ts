import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../potentiel.world';

EtantDonné(
  /le représentant légal importé du projet lauréat/,
  async function (this: PotentielWorld) {
    await importerReprésentantLégal.call(this);
  },
);

export async function importerReprésentantLégal(this: PotentielWorld) {
  const identifiantProjet = this.candidatureWorld.importerCandidature.identifiantProjet;
  const { importéLe } =
    this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture.créer();

  await mediator.send<ReprésentantLégal.ReprésentantLégalCommand>({
    type: 'Lauréat.ReprésentantLégal.Command.ImporterReprésentantLégal',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéLe: DateTime.convertirEnValueType(importéLe),
      importéPar: Email.system(),
    },
  });
}
