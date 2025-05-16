import { randomUUID } from 'crypto';

import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Accès, Lauréat } from '@potentiel-domain/projet';
import { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../../potentiel.world';
import { importerCandidature } from '../../../candidature/stepDefinitions/candidature.given';

import { choisirCahierDesCharges } from './lauréat.when';

EtantDonné('le projet lauréat {string}', async function (this: PotentielWorld, nomProjet: string) {
  await importerCandidature.call(this, nomProjet, 'classé');

  const dateDésignation = this.lauréatWorld.dateDésignation;

  await notifierLauréat.call(this, dateDésignation);

  await insérerProjetAvecDonnéesCandidature.call(this, dateDésignation, 'lauréat');
});

EtantDonné(
  'le projet lauréat {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();

    await importerCandidature.call(
      this,
      nomProjet,
      'classé',
      this.candidatureWorld.mapExempleToFixtureValues(exemple),
    );

    const dateDésignation = this.lauréatWorld.dateDésignation;

    await notifierLauréat.call(this, dateDésignation);

    await insérerProjetAvecDonnéesCandidature.call(this, dateDésignation, 'lauréat');
  },
);

EtantDonné(
  'le projet lauréat sans garanties financières importées {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { appelOffre, période } =
        this.candidatureWorld.identifiantProjetSansGarantiesFinancières;

      const dateDésignation = this.lauréatWorld.dateDésignation;

      await importerCandidature.call(this, nomProjet, 'classé', {
        typeGarantiesFinancièresValue: undefined,
        dateÉchéanceGfValue: undefined,
        appelOffreValue: appelOffre,
        périodeValue: période,
      });

      await notifierLauréat.call(this, dateDésignation);

      await insérerProjetAvecDonnéesCandidature.call(this, dateDésignation, 'lauréat');
    } catch (error) {
      this.error = error as Error;
    }
  },
);

EtantDonné(
  'le projet lauréat {string} ayant été notifié le {string}',
  async function (this: PotentielWorld, nomProjet: string, dateNotification: string) {
    const dateDésignation = new Date(dateNotification).toISOString();

    await importerCandidature.call(this, nomProjet, 'classé');

    await notifierLauréat.call(this, dateDésignation);

    await insérerProjetAvecDonnéesCandidature.call(this, dateDésignation, 'lauréat');
  },
);

EtantDonné(
  'le cahier des charges {string} choisi pour le projet lauréat',
  async function (this: PotentielWorld, cdcChoisi: string) {
    await choisirCahierDesCharges.call(this, cdcChoisi);
  },
);

export async function notifierLauréat(this: PotentielWorld, dateDésignation: string) {
  const candidature = this.candidatureWorld.importerCandidature;
  const identifiantProjetValue = IdentifiantProjet.convertirEnValueType(
    candidature.identifiantProjet,
  );
  this.lauréatWorld.identifiantProjet = identifiantProjetValue;
  const { nomProjet, notifiéLe } = this.lauréatWorld.notifierLauréatFixture.créer({
    nomProjet: candidature.values.nomProjetValue,
    localité: candidature.values.localitéValue,
    notifiéLe: dateDésignation,
    notifiéPar: this.utilisateurWorld.validateurFixture.email,
  });

  this.utilisateurWorld.porteurFixture.créer({
    email: this.candidatureWorld.importerCandidature.values.emailContactValue,
  });

  this.lauréatWorld.lauréatFixtures.set(candidature.values.nomProjetValue, {
    nom: nomProjet,
    identifiantProjet: identifiantProjetValue,
    dateDésignation: notifiéLe,
    appelOffre: identifiantProjetValue.appelOffre,
    période: identifiantProjetValue.période,
  });

  this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture.créer({
    importéLe: dateDésignation,
    nomReprésentantLégal: candidature.values.nomReprésentantLégalValue,
  });

  this.lauréatWorld.actionnaireWorld.importerActionnaireFixture.créer({
    importéLe: dateDésignation,
    actionnaire: candidature.values.sociétéMèreValue,
  });

  this.lauréatWorld.puissanceWorld.importerPuissanceFixture.créer({
    importéeLe: dateDésignation,
    puissance: candidature.values.puissanceProductionAnnuelleValue,
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

  await mediator.send<Lauréat.NotifierLauréatUseCase>({
    type: 'Lauréat.UseCase.NotifierLauréat',
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

// cette fonction serait supprimée après la migration de projet
export async function insérerProjetAvecDonnéesCandidature(
  this: PotentielWorld,
  dateDésignation: string,
  statutProjet: 'lauréat' | 'éliminé',
) {
  const { identifiantProjet, values: candidature } = this.candidatureWorld.importerCandidature;

  const identifiantProjetValue = IdentifiantProjet.convertirEnValueType(identifiantProjet);

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
    candidature.nomProjetValue,
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
    statutProjet === 'lauréat' ? 'Classé' : 'Eliminé',
    candidature.actionnariatValue === 'financement-participatif',
    candidature.actionnariatValue === 'investissement-participatif',
    candidature.puissanceALaPointeValue,
  );
}
