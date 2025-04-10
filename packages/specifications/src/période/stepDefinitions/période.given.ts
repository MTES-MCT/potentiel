import { Given as EtantDonné } from '@cucumber/cucumber';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { importerCandidature } from '../../candidature/stepDefinitions/candidature.given';
import { DeepPartial } from '../../fixture';

import { notifierPériode } from './période.when';

const candidats = [
  {
    dépôtCandidatureValue: {
      nomProjet: 'lauréat-1',
      sociétéMère: 'BonneMère-1',
    },
    instructionCandidatureValue: {
      statut: { statut: 'classé' },
    },
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'lauréat-1',
  },
  {
    dépôtCandidatureValue: {
      nomProjet: 'lauréat-2',
      sociétéMère: 'BonneMère-2',
    },
    instructionCandidatureValue: {
      statut: { statut: 'classé' },
    },
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'lauréat-2',
  },
  {
    dépôtCandidatureValue: {
      nomProjet: 'lauréat-3',
      sociétéMère: 'BonneMère-3',
    },
    instructionCandidatureValue: {
      statut: { statut: 'classé' },
    },
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'lauréat-3',
  },
  {
    dépôtCandidatureValue: {
      nomProjet: 'lauréat-4',
      sociétéMère: 'BonneMère-4',
    },
    instructionCandidatureValue: {
      statut: { statut: 'classé' },
    },
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'lauréat-4',
  },
  {
    dépôtCandidatureValue: {
      nomProjet: 'lauréat-5',
      sociétéMère: 'BonneMère-5',
    },
    instructionCandidatureValue: {
      statut: { statut: 'classé' },
    },
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'lauréat-5',
  },
  {
    dépôtCandidatureValue: {
      nomProjet: 'éliminé-1',
      sociétéMère: 'BonneMère-eliminé',
    },
    instructionCandidatureValue: {
      statut: { statut: 'classé' },
    },
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'éliminé-1',
  },
  {
    dépôtCandidatureValue: {
      nomProjet: 'éliminé-2',
    },
    instructionCandidatureValue: {
      statut: { statut: 'éliminé' },
    },
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'éliminé-2',
  },
  {
    dépôtCandidatureValue: {
      nomProjet: 'éliminé-3',
    },
    instructionCandidatureValue: {
      statut: { statut: 'éliminé' },
    },
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'éliminé-3',
  },
] satisfies DeepPartial<Candidature.ImporterCandidatureUseCase['data']>[];

EtantDonné(`une période avec des candidats importés`, async function (this: PotentielWorld) {
  await importerCandidatsPériode.call(this, candidats);
});

EtantDonné(`une période avec un candidat importé`, async function (this: PotentielWorld) {
  await importerCandidatsPériode.call(this, [candidats[0]]);
});

EtantDonné(`une période avec des candidats notifiés`, async function (this: PotentielWorld) {
  await importerCandidatsPériode.call(this, candidats);
  await notifierPériode.call(this);
});

EtantDonné(
  `des candidats oubliés pour la période d'appel d'offres`,
  async function (this: PotentielWorld) {
    const candidats = [
      {
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'lauréat-oublié-1',
        dépôtCandidatureValue: {
          nomProjet: 'lauréat-oublié-1',
          sociétéMère: 'BonneMère',
        },
        instructionCandidatureValue: {
          statut: { statut: 'classé' },
        },
      },
      {
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'lauréat-oublié-2',
        dépôtCandidatureValue: {
          nomProjet: 'lauréat-oublié-2',
        },
        instructionCandidatureValue: {
          statut: { statut: 'classé' },
        },
      },
      {
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'éliminé-oublié-3',
        dépôtCandidatureValue: {
          nomProjet: 'éliminé-oublié-3',
        },
        instructionCandidatureValue: {
          statut: { statut: 'éliminé' },
        },
      },
    ] satisfies DeepPartial<Candidature.ImporterCandidatureUseCase['data']>[];

    await importerCandidatsPériode.call(this, candidats);
  },
);

async function importerCandidatsPériode(
  this: PotentielWorld,
  candidats: (DeepPartial<Candidature.ImporterCandidatureUseCase['data']> & {
    dépôtCandidatureValue: {
      nomProjet: string;
    };
  })[],
) {
  for (const {
    dépôtCandidatureValue: { nomProjet },
    instructionCandidatureValue,
    ...data
  } of candidats) {
    await importerCandidature.call(
      this,
      nomProjet,
      instructionCandidatureValue?.statut?.statut as Candidature.StatutCandidature.RawType,
      data,
    );
  }
  this.périodeWorld.notifierPériodeFixture.ajouterCandidatsÀNotifier(
    candidats
      .filter((c) => c.instructionCandidatureValue?.statut?.statut === 'classé')
      .map(
        (c) =>
          [c.appelOffreValue, c.périodeValue, c.familleValue, c.numéroCREValue].join(
            '#',
          ) as IdentifiantProjet.RawType,
      ),
    candidats
      .filter((c) => c.instructionCandidatureValue?.statut?.statut === 'éliminé')
      .map(
        (c) =>
          [c.appelOffreValue, c.périodeValue, c.familleValue, c.numéroCREValue].join(
            '#',
          ) as IdentifiantProjet.RawType,
      ),
  );
}
