import { Given as EtantDonné } from '@cucumber/cucumber';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { importerCandidature } from '../../candidature/stepDefinitions/candidature.given';

import { notifierPériode } from './période.when';

type Candidat = {
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: Candidature.StatutCandidature.RawType;
  sociétéMère?: string;
};

const candidats = [
  {
    nomProjet: 'lauréat-1',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'lauréat-1',
    statut: 'classé',
    sociétéMère: 'BonneMère-1',
  },
  {
    nomProjet: 'lauréat-2',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'lauréat-2',
    statut: 'classé',
    sociétéMère: 'BonneMère-2',
  },
  {
    nomProjet: 'lauréat-3',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'lauréat-3',
    statut: 'classé',
    sociétéMère: 'BonneMère-3',
  },
  {
    nomProjet: 'lauréat-4',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'lauréat-4',
    statut: 'classé',
    sociétéMère: 'BonneMère-4',
  },
  {
    nomProjet: 'lauréat-5',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'lauréat-5',
    statut: 'classé',
    sociétéMère: 'BonneMère-5',
  },
  {
    nomProjet: 'éliminé-1',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'éliminé-1',
    statut: 'éliminé',
    sociétéMère: 'BonneMère-eliminé',
  },
  {
    nomProjet: 'éliminé-2',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'éliminé-2',
    statut: 'éliminé',
  },
  {
    nomProjet: 'éliminé-3',
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    famille: '',
    numéroCRE: 'éliminé-3',
    statut: 'éliminé',
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
        nomProjet: 'lauréat-oublié-1',
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: '',
        numéroCRE: 'lauréat-oublié-1',
        statut: 'classé',
        sociétéMère: 'BonneMère',
      },
      {
        nomProjet: 'lauréat-oublié-2',
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: '',
        numéroCRE: 'lauréat-oublié-2',
        statut: 'classé',
      },
      {
        nomProjet: 'éliminé-oublié-3',
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: '',
        numéroCRE: 'éliminé-oublié-3',
        statut: 'éliminé',
      },
    ] satisfies Candidat[];

    await importerCandidatsPériode.call(this, candidats);
  },
);

async function importerCandidatsPériode(this: PotentielWorld, candidats: Candidat[]) {
  for (const { nomProjet, statut: statut, sociétéMère, ...identifiantProjet } of candidats) {
    await importerCandidature.call(this, {
      nomProjet,
      statut,
      dépôt: { sociétéMère },
      identifiantProjet,
    });
  }
  this.périodeWorld.notifierPériodeFixture.ajouterCandidatsÀNotifier(
    candidats
      .filter((c) => c.statut === 'classé')
      .map(
        (c) =>
          [c.appelOffre, c.période, c.famille, c.numéroCRE].join('#') as IdentifiantProjet.RawType,
      ),
    candidats
      .filter((c) => c.statut === 'éliminé')
      .map(
        (c) =>
          [c.appelOffre, c.période, c.famille, c.numéroCRE].join('#') as IdentifiantProjet.RawType,
      ),
  );
}
