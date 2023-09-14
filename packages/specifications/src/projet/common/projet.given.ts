import { Given as EtantDonné } from '@cucumber/cucumber';
import { none } from '@potentiel/monads';
import { executeQuery } from '@potentiel/pg-helpers';
import { randomUUID } from 'crypto';
import { PotentielWorld } from '../../potentiel.world';

EtantDonné('le projet {string}', async function (this: PotentielWorld, nomProjet: string) {
  await executeQuery(
    `
      insert into "projects" (
        "id",
        "appelOffreId",
        "periodeId",
        "numeroCRE",
        "familleId",
        "nomCandidat",
        "nomProjet",
        "puissance",
        "prixReference",
        "evaluationCarbone",
        "note",
        "nomRepresentantLegal",
        "email",
        "codePostalProjet",
        "communeProjet",
        "departementProjet",
        "regionProjet",
        "classe",
        "isFinancementParticipatif",
        "isInvestissementParticipatif",
        "engagementFournitureDePuissanceAlaPointe"
      )
      values (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20,
        $21
      )
    `,
    randomUUID(),
    'PPE2 - Eolien',
    '1',
    '23',
    '',
    'nomCandidat',
    nomProjet,
    0,
    0,
    0,
    0,
    'nomRepresentantLegal',
    'email',
    'codePostalProjet',
    'communeProjet',
    'departementProjet',
    'Normandie',
    'Classé',
    false,
    false,
    false,
  );

  this.projetWorld.projetFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet: {
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      famille: none,
      numéroCRE: '23',
    },
  });
});

EtantDonné(
  'le projet {string} {string} de la région {string}',
  async function (
    this: PotentielWorld,
    statutProjet: string,
    nomProjet: string,
    régionProjet: string,
  ) {
    if (!['classé', 'éliminé', 'abandonné'].includes(statutProjet)) {
      throw new Error(
        `Le statut du projet est incorrect. Doit être : 'classé', 'éliminé' ou 'abandonné'`,
      );
    }
    const legacyId = randomUUID();
    await executeQuery(
      `
      insert into "projects" (
        "id",
        "appelOffreId",
        "periodeId",
        "numeroCRE",
        "familleId",
        "nomCandidat",
        "nomProjet",
        "puissance",
        "prixReference",
        "evaluationCarbone",
        "note",
        "nomRepresentantLegal",
        "email",
        "codePostalProjet",
        "communeProjet",
        "departementProjet",
        "regionProjet",
        "classe",
        "isFinancementParticipatif",
        "isInvestissementParticipatif",
        "engagementFournitureDePuissanceAlaPointe",
        "abandonedOn"
      )
      values (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20,
        $21,
        $22
      )
    `,
      legacyId,
      'PPE2 - Eolien',
      '1',
      '27',
      '',
      'nomCandidat',
      nomProjet,
      0,
      0,
      0,
      0,
      'nomRepresentantLegal',
      'email',
      'codePostalProjet',
      'communeProjet',
      'departementProjet',
      régionProjet,
      statutProjet === 'éliminé' ? 'Eliminé' : 'Classé',
      false,
      false,
      false,
      statutProjet === 'abandonné' ? new Date().getTime() : 0,
    );

    this.projetWorld.projetFixtures.set(nomProjet, {
      nom: nomProjet,
      identifiantProjet: {
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: none,
        numéroCRE: '27',
      },
      statut: statutProjet,
      appelOffre: 'PPE2 - Eolien',
      commune: 'communeProjet',
      département: 'departementProjet',
      famille: '',
      legacyId,
      numéroCRE: '27',
      période: '1',
      région: régionProjet,
    });
  },
);
