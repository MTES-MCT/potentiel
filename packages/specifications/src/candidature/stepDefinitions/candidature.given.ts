import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

import { mapExampleToUseCaseDefaultValues } from './helper';

async function importerCandidature(
  world: PotentielWorld,
  nomProjet: string,
  data: Record<string, string>,
) {
  const { values, identifiantProjet } = mapExampleToUseCaseDefaultValues(nomProjet, data);
  await mediator.send<Candidature.ImporterCandidatureUseCase>({
    type: 'Candidature.UseCase.ImporterCandidature',
    data: {
      ...values,
      importéLe: DateTime.convertirEnValueType(new Date('2024-08-20')).formatter(),
      importéPar: 'admin@test.test',
    },
  });

  world.candidatureWorld.candidatureFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    values,
  });
}

EtantDonné(`la candidature {string}`, async function (this: PotentielWorld, nomProjet: string) {
  await importerCandidature(this, nomProjet, {});
});

EtantDonné(
  `la candidature {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await importerCandidature(this, nomProjet, exemple);
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
