import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { none } from '@potentiel/monads';
import { executeQuery } from '@potentiel/pg-helpers';
import { randomUUID } from 'crypto';
import { PotentielWorld } from '../../potentiel.world';

EtantDonné('le projet {string}', async function (this: PotentielWorld, nomProjet: string) {
  const projetId = randomUUID();
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
    projetId,
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
    id: projetId,
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
  'le projet {string} de la région {string}',
  async function (this: PotentielWorld, nomProjet: string, régionProjet: string) {
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
      'Classé',
      false,
      false,
      false,
    );

    this.projetWorld.projetFixtures.set(nomProjet, {
      id: legacyId,
      nom: nomProjet,
      identifiantProjet: {
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: none,
        numéroCRE: '27',
      },
      statut: 'classé',
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

EtantDonné(
  `des porteurs associés au projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const {
      id: projetId,
      nom,
      identifiantProjet,
    } = this.projetWorld.rechercherProjetFixture(nomProjet);

    for (const [name, email] of table.rows()) {
      const porteurId = randomUUID();
      await executeQuery(
        `
      insert into "users" (
        "id",
        "fullName",
        "email",
        "role"
      )
      values (
        $1,
        $2,
        $3,
        $4
      )
    `,
        porteurId,
        name,
        email,
        'porteur-projet',
      );

      await executeQuery(
        `
      insert into "UserProjects" (
        "userId",
        "projectId"
      )
      values (
        $1,
        $2
      )
    `,
        porteurId,
        projetId,
      );
    }

    this.projetWorld.projetFixtures.set(nomProjet, {
      id: projetId,
      nom,
      identifiantProjet,
    });
  },
);
