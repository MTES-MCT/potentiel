import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { DeepPartial } from '../../fixture';
import { notifierLauréat } from '../../projet/lauréat/stepDefinitions/lauréat.given';
import { notifierÉliminé } from '../../projet/éliminé/stepDefinitions/éliminé.given';

EtantDonné(
  `la candidature lauréate {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await importerCandidature.call(
      this,
      nomProjet,
      'classé',
      this.candidatureWorld.mapExempleToFixtureValues(exemple),
    );
  },
);

EtantDonné(
  `la candidature éliminée {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'éliminé');
  },
);

EtantDonné(
  `la candidature lauréate {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'classé');
  },
);

EtantDonné(
  'la candidature lauréate notifiée {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'classé');

    const dateDésignation = this.lauréatWorld.dateDésignation;

    await notifierLauréat.call(this, dateDésignation);
  },
);

EtantDonné(
  'la candidature éliminée notifiée {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'éliminé');

    const dateDésignation = this.éliminéWorld.dateDésignation;

    await notifierÉliminé.call(this, dateDésignation);
  },
);

export async function importerCandidature(
  this: PotentielWorld,
  nomProjet: string,
  statut: Candidature.StatutCandidature.RawType,
  partialValues?: DeepPartial<Candidature.ImporterCandidatureUseCase['data']>,
) {
  const { values } = this.candidatureWorld.importerCandidature.créer({
    values: {
      ...partialValues,
      statutValue: statut,
      nomProjetValue: nomProjet,
      importéPar: this.utilisateurWorld.validateurFixture.email,
    },
  });

  await mediator.send<Candidature.ImporterCandidatureUseCase>({
    type: 'Candidature.UseCase.ImporterCandidature',
    data: values,
  });
}
