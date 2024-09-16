import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';

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
  `des candidats d'une période d'un appel d'offres`,
  async function (this: PotentielWorld) {
    const candidats = [
      {
        nomProjetValue: 'lauréat-1',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'lauréat-1',
        statutValue: 'classé',
      },
      {
        nomProjetValue: 'lauréat-2',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'lauréat-2',
        statutValue: 'classé',
      },
      {
        nomProjetValue: 'lauréat-3',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'lauréat-3',
        statutValue: 'classé',
      },
      {
        nomProjetValue: 'lauréat-4',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'lauréat-4',
        statutValue: 'classé',
      },
      {
        nomProjetValue: 'lauréat-5',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'lauréat-5',
        statutValue: 'classé',
      },
      {
        nomProjetValue: 'éliminé-1',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'éliminé-1',
        statutValue: 'éliminé',
      },
      {
        nomProjetValue: 'éliminé-2',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'éliminé-2',
        statutValue: 'éliminé',
      },
      {
        nomProjetValue: 'éliminé-3',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'éliminé-3',
        statutValue: 'éliminé',
      },
    ] satisfies Partial<Candidature.ImporterCandidatureUseCase['data']>[];

    for (const { nomProjetValue, statutValue, ...data } of candidats) {
      await importerCandidature.call(
        this,
        nomProjetValue,
        statutValue as Candidature.StatutCandidature.RawType,
        data,
      );
    }
  },
);

async function importerCandidature(
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
