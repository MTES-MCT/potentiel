import { randomUUID } from 'crypto';

import { Given as EtantDonné } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';

import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { DateTime } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { Éliminé } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../../potentiel.world';

EtantDonné('le projet éliminé {string}', async function (this: PotentielWorld, nomProjet: string) {
  const identifiantProjet = this.eliminéWorld.identifiantProjet;

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
    identifiantProjet.appelOffre,
    identifiantProjet.période,
    identifiantProjet.numéroCRE,
    identifiantProjet.famille,
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
    identifiantProjet,
    dateDésignation: notifiéLe.formatter(),
  });

  // TODO : Hack en attendant de revoir ces steps
  const éliminéNotifié: Éliminé.ÉliminéNotifiéEvent = {
    type: 'ÉliminéNotifié-V1',
    payload: {
      attestation: {
        format: 'application/pdf',
      },
      identifiantProjet: identifiantProjet.formatter(),
      notifiéLe: notifiéLe.formatter(),
      notifiéPar: faker.internet.email(),
    },
  };

  await publish(`éliminé|${identifiantProjet.formatter()}`, éliminéNotifié);
});
