import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';

EtantDonné(
  /le représentant légal importé du projet lauréat/,
  async function (this: PotentielWorld) {
    await importerReprésentantLégal.call(this);
  },
);

export async function importerReprésentantLégal(this: PotentielWorld) {
  const identifiantProjetValue = this.candidatureWorld.importerCandidature.identifiantProjet;
  const { importéLe } =
    this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture.créer();

  await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
    type: 'Lauréat.ReprésentantLégal.UseCase.ImporterReprésentantLégal',
    data: {
      identifiantProjetValue,
      importéLe,
    },
  });
}
