import { Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../potentiel.world.js';
import { importerCandidature } from '../../candidature/stepDefinitions/candidature.given.js';
import { Candidat } from '../fixtures/notifierPériode.fixture.js';
import { waitForSagasNotificationsAndProjectionsToFinish } from '../../helpers/waitForSagasNotificationsAndProjectionsToFinish.js';

import { notifierPériode } from './période.when.js';

const candidats = [
  {
    nomProjet: 'lauréat-1',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'lauréat-1',
    statut: 'classé',
    sociétéMère: 'BonneMère-1',
    emailContact: 'porteur1@test.test',
  },
  {
    nomProjet: 'lauréat-2',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'lauréat-2',
    statut: 'classé',
    sociétéMère: 'BonneMère-2',
    emailContact: 'porteur1@test.test', // même que précédemment pour tester plusieurs candidatures par porteur
  },
  {
    nomProjet: 'lauréat-3',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'lauréat-3',
    statut: 'classé',
    sociétéMère: 'BonneMère-3',
    emailContact: 'porteur2@test.test',
  },
  {
    nomProjet: 'lauréat-4',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'lauréat-4',
    statut: 'classé',
    sociétéMère: 'BonneMère-4',
    emailContact: 'porteur3@test.test',
  },
  {
    nomProjet: 'lauréat-5',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'lauréat-5',
    statut: 'classé',
    sociétéMère: 'BonneMère-5',
    emailContact: 'porteur4@test.test',
  },
  {
    nomProjet: 'éliminé-1',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'éliminé-1',
    statut: 'éliminé',
    sociétéMère: 'BonneMère-eliminé',
    emailContact: 'porteur1@test.test',
  },
  {
    nomProjet: 'éliminé-2',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'éliminé-2',
    statut: 'éliminé',
    emailContact: 'porteur5@test.test',
  },
  {
    nomProjet: 'éliminé-3',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'éliminé-3',
    statut: 'éliminé',
    emailContact: 'porteur6@test.test',
  },
] satisfies Candidat[];

EtantDonné(`une période avec des candidats importés`, async function (this: PotentielWorld) {
  await importerCandidatsPériode.call(this, candidats);
});

EtantDonné(`une période avec un candidat importé`, async function (this: PotentielWorld) {
  await importerCandidatsPériode.call(this, [candidats[0]]);
});

EtantDonné(`une période avec des candidats notifiés`, async function (this: PotentielWorld) {
  await importerCandidatsPériode.call(this, candidats);
  await waitForSagasNotificationsAndProjectionsToFinish();
  await notifierPériode.call(this);
});

EtantDonné(
  `des candidats oubliés pour la période d'appel d'offres`,
  async function (this: PotentielWorld) {
    const candidats = [
      {
        nomProjet: 'lauréat-oublié-1',
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: '',
        numéroCRE: 'lauréat-oublié-1',
        statut: 'classé',
        sociétéMère: 'BonneMère',
        emailContact: 'porteur1@test.test',
      },
      {
        nomProjet: 'lauréat-oublié-2',
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: '',
        numéroCRE: 'lauréat-oublié-2',
        statut: 'classé',
        emailContact: 'porteur2@test.test',
      },
      {
        nomProjet: 'éliminé-oublié-3',
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: '',
        numéroCRE: 'éliminé-oublié-3',
        statut: 'éliminé',
        emailContact: 'porteur1@test.test',
      },
    ] satisfies Candidat[];

    await importerCandidatsPériode.call(this, candidats);
  },
);

async function importerCandidatsPériode(this: PotentielWorld, candidats: Candidat[]) {
  for (const {
    nomProjet,
    statut: statut,
    sociétéMère,
    emailContact,
    ...identifiantProjet
  } of candidats) {
    await importerCandidature.call(this, {
      nomProjet,
      statut,
      dépôt: { sociétéMère, emailContact },
      identifiantProjet,
    });
  }
  this.périodeWorld.notifierPériodeFixture.ajouterCandidatsÀNotifier(
    candidats.filter((c) => c.statut === 'classé'),
    candidats.filter((c) => c.statut === 'éliminé'),
  );
}
