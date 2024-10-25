import { randomUUID } from 'crypto';

import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Éliminé } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../../potentiel.world';

// un projet éliminé
// est une candidature importée
// qui a été notifiée

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

  const notifiéLe = DateTime.convertirEnValueType(new Date('2022-10-27').toISOString());
  this.eliminéWorld.éliminéFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Eolien#1##23'),
    dateDésignation: notifiéLe.formatter(),
  });

  // TODO : Hack en attendant de revoir ces steps
  const data = {
    identifiantProjetValue: 'PPE2 - Eolien#1##23',
    notifiéLeValue: notifiéLe.formatter(),
    notifiéParValue: this.utilisateurWorld.validateurFixture.email,
    attestationValue: {
      format: 'application/pdf',
    },
    validateurValue: {
      fonction: this.utilisateurWorld.validateurFixture.fonction,
      nomComplet: this.utilisateurWorld.validateurFixture.nom,
    },
  };

  await mediator.send<Éliminé.NotifierÉliminéUseCase>({
    type: 'Éliminé.UseCase.NotifierÉliminé',
    data,
  });
});

EtantDonné(
  'le projet éliminé {string} ayant été notifié le {string}',
  async function (this: PotentielWorld, nomProjet: string, dateNotification: string) {
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

    // violette
    // ajouter le hack

    this.eliminéWorld.éliminéFixtures.set(nomProjet, {
      nom: nomProjet,
      identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Eolien#1##23'),
      dateDésignation: new Date(dateNotification).toISOString(),
    });
  },
);

EtantDonné(
  'le projet éliminé {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const examples = dataTable.rowsHash();
    const dateDésignation = new Date(
      examples['La date de désignation'] ?? '2022-10-27',
    ).toISOString();
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

    this.eliminéWorld.éliminéFixtures.set(nomProjet, {
      nom: nomProjet,
      identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Eolien#1##23'),
      dateDésignation,
    });

    // violette
    // ajouter le hack
  },
);
