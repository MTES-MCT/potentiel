import { randomUUID } from 'crypto';

import { Given as EtantDonné } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import { mediator } from 'mediateur';

import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { DateTime } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { Éliminé } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../../potentiel.world';
import { importerCandidature } from '../../../candidature/stepDefinitions/candidature.given';
import { vérifierAttestationDeDésignation } from '../../../candidature/stepDefinitions/candidature.then';

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

  const notifiéLe = DateTime.convertirEnValueType(new Date('2022-10-27')).formatter();

  this.eliminéWorld.éliminéFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet,
    dateDésignation: notifiéLe,
  });

  // TODO : Hack en attendant de revoir ces steps
  const éliminéNotifié: Éliminé.ÉliminéNotifiéEvent = {
    type: 'ÉliminéNotifié-V1',
    payload: {
      attestation: {
        format: 'application/pdf',
      },
      identifiantProjet: identifiantProjet.formatter(),
      notifiéLe: notifiéLe,
      notifiéPar: faker.internet.email(),
    },
  };

  await publish(`éliminé|${identifiantProjet.formatter()}`, éliminéNotifié);
});

EtantDonné(
  'le projet éliminé {string} ayant été notifié le {string}',
  async function (this: PotentielWorld, nomProjet: string, dateNotification: string) {
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

    const notifiéLe = DateTime.convertirEnValueType(new Date(dateNotification)).formatter();

    this.eliminéWorld.éliminéFixtures.set(nomProjet, {
      nom: nomProjet,
      identifiantProjet,
      dateDésignation: notifiéLe,
    });

    // TODO : Hack en attendant de revoir ces steps
    const éliminéNotifié: Éliminé.ÉliminéNotifiéEvent = {
      type: 'ÉliminéNotifié-V1',
      payload: {
        attestation: {
          format: 'application/pdf',
        },
        identifiantProjet: identifiantProjet.formatter(),
        notifiéLe: notifiéLe,
        notifiéPar: faker.internet.email(),
      },
    };

    await publish(`éliminé|${identifiantProjet.formatter()}`, éliminéNotifié);
  },
);

EtantDonné(
  'la candidature éliminée notifiée {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'éliminé');
    await notifierÉliminé.call(this);
  },
);

async function notifierÉliminé(this: PotentielWorld) {
  const { identifiantProjet } = this.candidatureWorld.importerCandidature;
  this.utilisateurWorld.porteurFixture.créer({
    email: this.candidatureWorld.importerCandidature.values.emailContactValue,
  });

  const data = {
    identifiantProjetValue: identifiantProjet,
    notifiéLeValue: DateTime.now().formatter(),
    notifiéParValue: this.utilisateurWorld.validateurFixture.email,
    attestationValue: {
      format: `application/pdf`,
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
  // on vérifie l'attestation de désignation dès le "given"
  // afin de s'assurer que la saga est bien exécutée
  await vérifierAttestationDeDésignation(identifiantProjet);
}
