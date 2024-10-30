import { randomUUID } from 'crypto';

import { Given as EtantDonné } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';

import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/laureat';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { PotentielWorld } from '../../../potentiel.world';

EtantDonné('le projet lauréat {string}', async function (this: PotentielWorld, nomProjet: string) {
  const dateDésignation = new Date('2022-10-27').toISOString();
  const identifiantProjet = this.lauréatWorld.identifiantProjet;

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
    identifiantProjet.appelOffre,
    identifiantProjet.période,
    identifiantProjet.numéroCRE,
    identifiantProjet.famille,
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
    appelOffre: identifiantProjet.appelOffre,
    période: identifiantProjet.période,
  });

  // TODO : Hack en attendant de revoir ces steps
  const notifiéLe = DateTime.convertirEnValueType(dateDésignation).formatter();

  const lauréatNotifié: Lauréat.LauréatNotifiéEvent = {
    type: 'LauréatNotifié-V1',
    payload: {
      attestation: {
        format: 'application/pdf',
      },
      identifiantProjet: identifiantProjet.formatter(),
      notifiéLe: notifiéLe,
      notifiéPar: faker.internet.email(),
    },
  };

  await publish(`lauréat|${identifiantProjet.formatter()}`, lauréatNotifié);
});

EtantDonné(
  'le projet lauréat {string} ayant été notifié le {string}',
  async function (this: PotentielWorld, nomProjet: string, dateNotification: string) {
    const dateDésignation = new Date(dateNotification).toISOString();
    const identifiantProjet = this.lauréatWorld.identifiantProjet;

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
      identifiantProjet.appelOffre,
      identifiantProjet.période,
      identifiantProjet.numéroCRE,
      identifiantProjet.famille,
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
      appelOffre: identifiantProjet.appelOffre,
      période: identifiantProjet.période,
    });

    // TODO : Hack en attendant de revoir ces steps
    const notifiéLe = DateTime.convertirEnValueType(dateDésignation).formatter();

    const lauréatNotifié: Lauréat.LauréatNotifiéEvent = {
      type: 'LauréatNotifié-V1',
      payload: {
        attestation: {
          format: 'application/pdf',
        },
        identifiantProjet: identifiantProjet.formatter(),
        notifiéLe: notifiéLe,
        notifiéPar: faker.internet.email(),
      },
    };

    await publish(`lauréat|${identifiantProjet.formatter()}`, lauréatNotifié);
  },
);
