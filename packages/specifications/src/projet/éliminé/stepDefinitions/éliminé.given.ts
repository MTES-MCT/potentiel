import { randomUUID } from 'crypto';

import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Éliminé } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../../potentiel.world';
import { importerCandidature } from '../../../candidature/stepDefinitions/candidature.given';

EtantDonné('le projet éliminé {string}', async function (this: PotentielWorld, nomProjet: string) {
  const dateDésignation = new Date('2022-10-27').toISOString();

  await importerCandidature.call(this, nomProjet, 'éliminé');

  const { identifiantProjet, values: candidature } = this.candidatureWorld.importerCandidature;

  const identifiantProjetValue = IdentifiantProjet.convertirEnValueType(identifiantProjet);

  await notifierÉliminé.call(this, dateDésignation);

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
    identifiantProjetValue.appelOffre,
    identifiantProjetValue.période,
    identifiantProjetValue.numéroCRE,
    identifiantProjetValue.famille,
    new Date(dateDésignation).getTime(),
    candidature.nomCandidatValue,
    nomProjet,
    candidature.puissanceProductionAnnuelleValue,
    candidature.prixReferenceValue,
    candidature.evaluationCarboneSimplifiéeValue,
    candidature.noteTotaleValue,
    candidature.nomReprésentantLégalValue,
    candidature.emailContactValue,
    candidature.localitéValue.codePostal,
    candidature.localitéValue.commune,
    candidature.localitéValue.département,
    candidature.localitéValue.région,
    'Eliminé',
    candidature.actionnariatValue === 'financement-participatif',
    candidature.actionnariatValue === 'investissement-participatif',
    candidature.puissanceALaPointeValue,
  );
});

EtantDonné(
  'le projet éliminé {string} ayant été notifié le {string}',
  async function (this: PotentielWorld, nomProjet: string, dateNotification: string) {
    const dateDésignation = new Date(dateNotification).toISOString();

    await importerCandidature.call(this, nomProjet, 'éliminé');

    const { identifiantProjet, values: candidature } = this.candidatureWorld.importerCandidature;

    const identifiantProjetValue = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    await notifierÉliminé.call(this, dateDésignation);

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
      identifiantProjetValue.appelOffre,
      identifiantProjetValue.période,
      identifiantProjetValue.numéroCRE,
      identifiantProjetValue.famille,
      new Date(dateDésignation).getTime(),
      candidature.nomCandidatValue,
      nomProjet,
      candidature.puissanceProductionAnnuelleValue,
      candidature.prixReferenceValue,
      candidature.evaluationCarboneSimplifiéeValue,
      candidature.noteTotaleValue,
      candidature.nomReprésentantLégalValue,
      candidature.emailContactValue,
      candidature.localitéValue.codePostal,
      candidature.localitéValue.commune,
      candidature.localitéValue.département,
      candidature.localitéValue.région,
      'Eliminé',
      candidature.actionnariatValue === 'financement-participatif',
      candidature.actionnariatValue === 'investissement-participatif',
      candidature.puissanceALaPointeValue,
    );
  },
);

async function notifierÉliminé(this: PotentielWorld, dateDésignation: string) {
  const candidature = this.candidatureWorld.importerCandidature;
  const identifiantProjetValue = IdentifiantProjet.convertirEnValueType(
    candidature.identifiantProjet,
  );

  this.utilisateurWorld.porteurFixture.créer({
    email: this.candidatureWorld.importerCandidature.values.emailContactValue,
  });

  this.eliminéWorld.identifiantProjet = identifiantProjetValue;

  this.eliminéWorld.éliminéFixtures.set(candidature.values.nomProjetValue, {
    nom: candidature.values.nomProjetValue,
    identifiantProjet: identifiantProjetValue,
    dateDésignation,
  });

  const data = {
    identifiantProjetValue: identifiantProjetValue.formatter(),
    notifiéLeValue: dateDésignation,
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
}
