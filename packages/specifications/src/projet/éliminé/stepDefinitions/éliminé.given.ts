import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';
import { Accès, Candidature } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world';
import { importerCandidature } from '../../../candidature/stepDefinitions/candidature.given';
import { importerCandidaturePériodeLegacy } from '../../../candidature/stepDefinitions/candidatureLegacy.given';
import { waitForSagasNotificationsAndProjectionsToFinish } from '../../../helpers/waitForSagasNotificationsAndProjectionsToFinish';

EtantDonné('le projet éliminé {string}', async function (this: PotentielWorld, nomProjet: string) {
  await importerCandidature.call(this, { nomProjet, statut: 'éliminé' });
  await waitForSagasNotificationsAndProjectionsToFinish();
  await notifierÉliminé.call(this);
});

EtantDonné(
  'le projet éliminé {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();

    await importerCandidature.call(this, {
      nomProjet,
      statut: 'éliminé',
      ...this.candidatureWorld.mapExempleToFixtureValues(exemple),
    });

    const dateDésignation = exemple['date notification']
      ? new Date(exemple['date notification']).toISOString()
      : undefined;

    await waitForSagasNotificationsAndProjectionsToFinish();
    await notifierÉliminé.call(this, dateDésignation);
  },
);

EtantDonné(
  'le projet éliminé legacy {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();

    await importerCandidaturePériodeLegacy.call(this, nomProjet, 'éliminé', exemple);

    await waitForSagasNotificationsAndProjectionsToFinish();
    await notifierÉliminé.call(this);
  },
);
export async function notifierÉliminé(this: PotentielWorld, dateDésignation?: string) {
  const candidature = this.candidatureWorld.importerCandidature;
  const identifiantProjetValue = candidature.identifiantProjet;

  this.utilisateurWorld.porteurFixture.créer({
    email: this.candidatureWorld.importerCandidature.values.emailContactValue,
  });

  const { notifiéPar, notifiéLe } = this.éliminéWorld.notifier({
    notifiéPar: this.utilisateurWorld.validateurFixture.email,
    identifiantProjet: identifiantProjetValue,
    ...(dateDésignation ? { notifiéLe: dateDésignation } : {}),
  });

  await mediator.send<Candidature.NotifierCandidatureUseCase>({
    type: 'Candidature.UseCase.NotifierCandidature',
    data: {
      identifiantProjetValue,
      notifiéeLeValue: notifiéLe,
      notifiéeParValue: notifiéPar,
      attestationValue: {
        format: `application/pdf`,
      },
      validateurValue: {
        fonction: this.utilisateurWorld.validateurFixture.fonction,
        nomComplet: this.utilisateurWorld.validateurFixture.nom,
      },
    },
  });

  // L'invitation du porteur est normalement faite lors de la notification de la période
  // Ce cas n'est utile que pour les tests
  await mediator.send<InviterPorteurUseCase>({
    type: 'Utilisateur.UseCase.InviterPorteur',
    data: {
      identifiantUtilisateurValue: candidature.values.emailContactValue,
      identifiantsProjetValues: [identifiantProjetValue],
      invitéLeValue: notifiéLe,
      invitéParValue: Email.système.formatter(),
    },
  });

  await mediator.send<Accès.AutoriserAccèsProjetUseCase>({
    type: 'Projet.Accès.UseCase.AutoriserAccèsProjet',
    data: {
      identifiantProjetValue,
      identifiantUtilisateurValue: candidature.values.emailContactValue,
      autoriséLeValue: notifiéLe,
      autoriséParValue: Email.système.formatter(),
      raison: 'notification',
    },
  });
}
