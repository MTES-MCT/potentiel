import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { Lauréat } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';
import { DeepPartial } from '../../fixture';

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

    const identifiantProjet = this.candidatureWorld.importerCandidature.identifiantProjet;

    this.lauréatWorld.notifierLauréatFixture.créer({
      identifiantProjet,
    });

    this.utilisateurWorld.porteurFixture.créer({
      email: this.candidatureWorld.importerCandidature.values.emailContactValue,
    });

    await mediator.send<Lauréat.NotifierLauréatUseCase>({
      type: 'Lauréat.UseCase.NotifierLauréat',
      data: {
        identifiantProjetValue: identifiantProjet,
        notifiéLeValue: DateTime.now().formatter(),
        notifiéParValue: this.utilisateurWorld.validateurFixture.email,
        validateurValue: {
          fonction: this.utilisateurWorld.validateurFixture.fonction,
          nomComplet: this.utilisateurWorld.validateurFixture.nom,
        },
        attestationValue: {
          format: `text/plain`,
        },
      },
    });
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
