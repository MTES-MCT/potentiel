import { randomUUID } from 'crypto';

import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../potentiel.world';

EtantDonné('le projet lauréat {string}', async function (this: PotentielWorld, nomProjet: string) {
  const dateDésignation = new Date('2022-10-27').toISOString();
  const appelOffre = 'PPE2 - Eolien';
  const période = '1';
  const numéroCRE = '23';
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(
    `${appelOffre}#${période}##${numéroCRE}`,
  );

  await executeQuery(
    `
      insert into "projects" (
        "id",
        "appelOffreId",
        "periodeId",
        "numeroCRE",
        "familleId",
        "notifiedOn",
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
        $21,
        $22
      )
    `,
    randomUUID(),
    appelOffre,
    période,
    numéroCRE,
    '',
    new Date(dateDésignation).getTime(),
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
    identifiantProjet,
    dateDésignation,
    appelOffre,
    période,
  });
});

EtantDonné(
  'le projet lauréat {string} ayant été notifié le {string}',
  async function (this: PotentielWorld, nomProjet: string, dateNotification: string) {
    const dateDésignation = new Date(dateNotification).toISOString();
    const appelOffre = 'PPE2 - Eolien';
    const période = '1';
    const numéroCRE = '23';
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      `${appelOffre}#${période}##${numéroCRE}`,
    );

    await executeQuery(
      `
      insert into "projects" (
        "id",
        "appelOffreId",
        "periodeId",
        "numeroCRE",
        "familleId",
        "notifiedOn",
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
        $21,
        $22
      )
    `,
      randomUUID(),
      appelOffre,
      période,
      numéroCRE,
      '',
      new Date(dateDésignation).getTime(),
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
      identifiantProjet,
      dateDésignation,
      appelOffre,
      période,
    });
  },
);

EtantDonné(
  'le projet lauréat {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const examples = dataTable.rowsHash();
    const dateDésignation =
      examples['La date de désignation'] ?? new Date('2022-10-27').toISOString();
    const appelOffre = 'PPE2 - Eolien';
    const période = '1';
    const numéroCRE = '23';
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      `${appelOffre}#${période}##${numéroCRE}`,
    );
    await executeQuery(
      `
      insert into "projects" (
        "id",
        "appelOffreId",
        "periodeId",
        "numeroCRE",
        "familleId",
        "notifiedOn",
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
        $21,
        $22
      )
    `,
      randomUUID(),
      appelOffre,
      période,
      numéroCRE,
      '',
      new Date(dateDésignation).getTime(),
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
      identifiantProjet,
      dateDésignation,
      appelOffre,
      période,
    });
  },
);
