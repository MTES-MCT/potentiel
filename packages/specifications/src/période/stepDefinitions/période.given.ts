import { Given as EtantDonné } from '@cucumber/cucumber';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { importerCandidature } from '../../candidature/stepDefinitions/candidature.given.js';
import { waitForSagasNotificationsAndProjectionsToFinish } from '../../helpers/waitForSagasNotificationsAndProjectionsToFinish.js';
import type { PotentielWorld } from '../../potentiel.world.js';
import type { CandidatAvecInstruction } from '../fixtures/importerPériode.fixture.js';
import type { Candidat } from '../fixtures/notifierPériode.fixture.js';
import { notifierPériode } from './période.when.js';

const candidats = [
  {
    nomProjet: 'lauréat-1',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    périodeTitle: 'première',
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
    périodeTitle: 'première',
    famille: '',
    numéroCRE: 'lauréat-2',
    statut: 'classé',
    sociétéMère: 'BonneMère-2',
    emailContact: 'porteur1@test.test', // même que précédemment pour tester plusieurs candidatures par porteur
  },
  {
    nomProjet: 'lauréat-3',
    appelOffre: 'PPE2 - Eolien',
    période: '2',
    périodeTitle: 'deuxième',
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
    périodeTitle: 'première',
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
    périodeTitle: 'première',
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
    périodeTitle: 'première',
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
    périodeTitle: 'première',
    famille: '',
    numéroCRE: 'éliminé-2',
    statut: 'éliminé',
    emailContact: 'porteur5@test.test',
  },
  {
    nomProjet: 'éliminé-3',
    appelOffre: 'PPE2 - Eolien',
    période: '3',
    périodeTitle: 'troisième',
    famille: '',
    numéroCRE: 'éliminé-3',
    statut: 'éliminé',
    emailContact: 'porteur6@test.test',
  },
] satisfies Candidat[];

EtantDonné(`une période avec des candidats à importer`, async function (this: PotentielWorld) {
  const candidats = [
    {
      dépôt: {
        nomProjet: 'lauréat-1',
        nomCandidat: 'lauréat-1',
        emailContact: 'porteur1@test.test',
        sociétéMère: 'BonneMère-1',
        nomReprésentantLégal: 'RL-1',
        prixReference: 78,
        localité: {
          adresse1: 'adresse 1',
          codePostal: '75019',
          commune: 'Paris',
          département: 'Paris',
          région: 'Île-de-France',
          adresse2: '',
        },
        historiqueAbandon: 'première-candidature',
        puissance: 10,
        puissanceALaPointe: false,
        evaluationCarboneSimplifiée: 700,
        technologie: 'eolien',
        typeGarantiesFinancières: 'six-mois-après-achèvement',
        territoireProjet: '',
        fournisseurs: [],
        actionnariat: undefined,
        attestationConstitutionGf: undefined,
        autorisation: undefined,
        coefficientKChoisi: undefined,
        coordonnées: undefined,
        dateConstitutionGf: undefined,
        dateÉchéanceGf: undefined,
        dispositifDeStockage: undefined,
        installateur: undefined,
        natureDeLExploitation: undefined,
        numéroIdentification: undefined,
        obligationDeSolarisation: undefined,
        puissanceDeSite: undefined,
        puissanceDuProjetInitial: undefined,
        raccordements: undefined,
        typologieInstallation: [],
      },
      identifiant: IdentifiantProjet.bind({
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        numéroCRE: 'test-1',
        famille: '',
      }).formatter(),
      instruction: { statut: 'classé', noteTotale: 17 },
    },
    {
      dépôt: {
        nomProjet: 'éliminé-2',
        nomCandidat: 'éliminé-2',
        emailContact: 'porteur1@test.test',
        sociétéMère: 'BonneMère-1',
        nomReprésentantLégal: 'RL-1',
        prixReference: 200,
        localité: {
          adresse1: 'adresse 1',
          codePostal: '75019',
          commune: 'Paris',
          département: 'Paris',
          région: 'Île-de-France',
          adresse2: '',
        },
        historiqueAbandon: 'première-candidature',
        puissance: 10,
        puissanceALaPointe: false,
        evaluationCarboneSimplifiée: 900,
        technologie: 'eolien',
        territoireProjet: '',
        fournisseurs: [],
        actionnariat: undefined,
        attestationConstitutionGf: undefined,
        autorisation: undefined,
        coefficientKChoisi: undefined,
        coordonnées: undefined,
        dateConstitutionGf: undefined,
        dateÉchéanceGf: undefined,
        dispositifDeStockage: undefined,
        installateur: undefined,
        natureDeLExploitation: undefined,
        numéroIdentification: undefined,
        obligationDeSolarisation: undefined,
        puissanceDeSite: undefined,
        puissanceDuProjetInitial: undefined,
        raccordements: undefined,
        typeGarantiesFinancières: undefined,
        typologieInstallation: [],
      },
      identifiant: IdentifiantProjet.bind({
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        numéroCRE: 'test-2',
        famille: '',
      }).formatter(),
      instruction: { statut: 'éliminé', noteTotale: 9 },
    },
  ] satisfies CandidatAvecInstruction[];
  this.périodeWorld.importerPériodeFixture.ajouterCandidatsÀImporter(candidats);
});

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
        périodeTitle: 'première',
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
        périodeTitle: 'première',
        période: '1',
        famille: '',
        numéroCRE: 'lauréat-oublié-2',
        statut: 'classé',
        emailContact: 'porteur2@test.test',
      },
      {
        nomProjet: 'éliminé-oublié-3',
        appelOffre: 'PPE2 - Eolien',
        périodeTitle: 'première',
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
  for (const { nomProjet, statut, sociétéMère, emailContact, ...identifiantProjet } of candidats) {
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
