import { randomUUID } from 'crypto';

import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { Email, IdentifiantProjet } from '@potentiel-domain/common';
import { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';
import { Accès, Éliminé } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world';
import { importerCandidature } from '../../../candidature/stepDefinitions/candidature.given';

EtantDonné('le projet éliminé {string}', async function (this: PotentielWorld, nomProjet: string) {
  // un projet éliminé a rarement ces informations lors d'un import de candidature
  await importerCandidature.call(this, nomProjet, 'éliminé', {
    typeGarantiesFinancièresValue: undefined,
    dateÉchéanceGfValue: undefined,
  });

  const { identifiantProjet, values: candidature } = this.candidatureWorld.importerCandidature;

  const identifiantProjetValue = IdentifiantProjet.convertirEnValueType(identifiantProjet);

  const dateDésignation = this.eliminéWorld.dateDésignation;

  await notifierÉliminé.call(this, dateDésignation);

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
    identifiantProjetValue.appelOffre,
    identifiantProjetValue.période,
    identifiantProjetValue.numéroCRE,
    identifiantProjetValue.famille,
    new Date(dateDésignation).getTime(),
    candidature.nomCandidatValue,
    nomProjet,
    candidature.puissanceProductionAnnuelleValue,
    candidature.prixRéférenceValue,
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
      identifiantProjetValue.appelOffre,
      identifiantProjetValue.période,
      identifiantProjetValue.numéroCRE,
      identifiantProjetValue.famille,
      new Date(dateDésignation).getTime(),
      candidature.nomCandidatValue,
      nomProjet,
      candidature.puissanceProductionAnnuelleValue,
      candidature.prixRéférenceValue,
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

export async function notifierÉliminé(this: PotentielWorld, dateDésignation: string) {
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

  // L'invitation du porteur est normalement faite lors de la notification de la période
  // Ce cas n'est utile que pour les tests
  await mediator.send<InviterPorteurUseCase>({
    type: 'Utilisateur.UseCase.InviterPorteur',
    data: {
      identifiantUtilisateurValue: candidature.values.emailContactValue,
      identifiantsProjetValues: [identifiantProjetValue.formatter()],
      invitéLeValue: dateDésignation,
      invitéParValue: Email.system().formatter(),
    },
  });

  await mediator.send<Accès.AutoriserAccèsProjetUseCase>({
    type: 'Projet.Accès.UseCase.AutoriserAccèsProjet',
    data: {
      identifiantProjetValues: [identifiantProjetValue.formatter()],
      identifiantUtilisateurValue: candidature.values.emailContactValue,
      autoriséLeValue: dateDésignation,
      autoriséParValue: Email.system().formatter(),
      raison: 'notification',
    },
  });
}
