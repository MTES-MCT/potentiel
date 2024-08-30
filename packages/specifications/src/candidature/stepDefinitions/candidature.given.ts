import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { StatutProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';
import { DeepPartial } from '../../fixture';

async function importerCandidature(
  this: PotentielWorld,
  nomProjet: string,
  statut: StatutProjet.RawType,
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
  `des candidats d'une période d'un appel d'offres`,
  async function (this: PotentielWorld) {
    const candidats = [
      {
        nomProjet: 'lauréat-1',
        "appel d'offre": 'PPE2 - Eolien',
        période: '1',
        famille: '',
        'numéro CRE': 'lauréat-1',
        statut: 'classé',
      },
      {
        nomProjet: 'lauréat-2',
        "appel d'offre": 'PPE2 - Eolien',
        période: '1',
        famille: '',
        'numéro CRE': 'lauréat-2',
        statut: 'classé',
      },
      {
        nomProjet: 'lauréat-3',
        "appel d'offre": 'PPE2 - Eolien',
        période: '1',
        famille: '',
        'numéro CRE': 'lauréat-3',
        statut: 'classé',
      },
      {
        nomProjet: 'lauréat-4',
        "appel d'offre": 'PPE2 - Eolien',
        période: '1',
        famille: '',
        'numéro CRE': 'lauréat-4',
        statut: 'classé',
      },
      {
        nomProjet: 'lauréat-5',
        "appel d'offre": 'PPE2 - Eolien',
        période: '1',
        famille: '',
        'numéro CRE': 'lauréat-5',
        statut: 'classé',
      },
      {
        nomProjet: 'éliminé-1',
        "appel d'offre": 'PPE2 - Eolien',
        période: '1',
        famille: '',
        'numéro CRE': 'éliminé-1',
        statut: 'éliminé',
      },
      {
        nomProjet: 'éliminé-2',
        "appel d'offre": 'PPE2 - Eolien',
        période: '1',
        famille: '',
        'numéro CRE': 'éliminé-2',
        statut: 'éliminé',
      },
      {
        nomProjet: 'éliminé-3',
        "appel d'offre": 'PPE2 - Eolien',
        période: '1',
        famille: '',
        'numéro CRE': 'éliminé-3',
        statut: 'éliminé',
      },
    ];

    for (const { nomProjet, ...data } of candidats) {
      await importerCandidature(this, nomProjet, data);
    }
  },
);
