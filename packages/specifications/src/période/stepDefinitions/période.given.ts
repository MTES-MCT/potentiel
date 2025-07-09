import { Given as EtantDonné } from '@cucumber/cucumber';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { importerCandidature } from '../../candidature/stepDefinitions/candidature.given';

import { notifierPériode } from './période.when';

type Candidat = {
  nomProjetValue: string;
  appelOffreValue: string;
  périodeValue: string;
  familleValue: string;
  numéroCREValue: string;
  statutValue: string;
  sociétéMèreValue?: string;
};

const candidats = [
  {
    nomProjetValue: 'lauréat-1',
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'lauréat-1',
    statutValue: 'classé',
    sociétéMèreValue: 'BonneMère-1',
  },
  {
    nomProjetValue: 'lauréat-2',
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'lauréat-2',
    statutValue: 'classé',
    sociétéMèreValue: 'BonneMère-2',
  },
  {
    nomProjetValue: 'lauréat-3',
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'lauréat-3',
    statutValue: 'classé',
    sociétéMèreValue: 'BonneMère-3',
  },
  {
    nomProjetValue: 'lauréat-4',
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'lauréat-4',
    statutValue: 'classé',
    sociétéMèreValue: 'BonneMère-4',
  },
  {
    nomProjetValue: 'lauréat-5',
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'lauréat-5',
    statutValue: 'classé',
    sociétéMèreValue: 'BonneMère-5',
  },
  {
    nomProjetValue: 'éliminé-1',
    appelOffreValue: 'PPE2 - Eolien',
    périodeValue: '1',
    familleValue: '',
    numéroCREValue: 'éliminé-1',
    statutValue: 'éliminé',
    sociétéMèreValue: 'BonneMère-eliminé',
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
] as Candidat[];

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
        nomProjetValue: 'lauréat-oublié-1',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'lauréat-oublié-1',
        statutValue: 'classé',
        sociétéMèreValue: 'BonneMère',
      },
      {
        nomProjetValue: 'lauréat-oublié-2',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'lauréat-oublié-2',
        statutValue: 'classé',
      },
      {
        nomProjetValue: 'éliminé-oublié-3',
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
        familleValue: '',
        numéroCREValue: 'éliminé-oublié-3',
        statutValue: 'éliminé',
      },
    ] satisfies Candidat[];

    await importerCandidatsPériode.call(this, candidats);
  },
);

async function importerCandidatsPériode(
  this: PotentielWorld,
  candidats: (Partial<Candidature.ImporterCandidatureUseCase['data']> & {
    nomProjetValue: string;
  })[],
) {
  for (const { nomProjetValue, statutValue, ...data } of candidats) {
    await importerCandidature.call(
      this,
      nomProjetValue,
      statutValue as Candidature.StatutCandidature.RawType,
      data,
    );
  }
  this.périodeWorld.notifierPériodeFixture.ajouterCandidatsÀNotifier(
    candidats
      .filter((c) => c.statutValue === 'classé')
      .map(
        (c) =>
          [c.appelOffreValue, c.périodeValue, c.familleValue, c.numéroCREValue].join(
            '#',
          ) as IdentifiantProjet.RawType,
      ),
    candidats
      .filter((c) => c.statutValue === 'éliminé')
      .map(
        (c) =>
          [c.appelOffreValue, c.périodeValue, c.familleValue, c.numéroCREValue].join(
            '#',
          ) as IdentifiantProjet.RawType,
      ),
  );
}
