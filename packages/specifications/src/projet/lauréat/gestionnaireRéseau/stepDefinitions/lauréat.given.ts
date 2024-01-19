import { Given as EtantDonné } from '@cucumber/cucumber';
import { executeQuery } from '@potentiel/pg-helpers';
import { randomUUID } from 'crypto';
import { PotentielWorld } from '../../../../potentiel.world';
import { IdentifiantProjet } from '@potentiel-domain/common';

EtantDonné('le projet lauréat {string}', async function (this: PotentielWorld, nomProjet: string) {
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
    'regionProjet',
    'Classé',
    false,
    false,
    false,
  );

  this.lauréatWorld.lauréatFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Eolien#1##23'),
  });
});

EtantDonné('le projet éliminé {string}', async function (this: PotentielWorld, nomProjet: string) {
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
    'regionProjet',
    'Eliminé',
    false,
    false,
    false,
  );

  this.lauréatWorld.lauréatFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Eolien#1##23'),
  });
});
