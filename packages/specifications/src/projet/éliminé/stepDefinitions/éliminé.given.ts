import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Email, IdentifiantProjet } from '@potentiel-domain/common';
import { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';
import { Accès, Éliminé } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world';
import { importerCandidature } from '../../../candidature/stepDefinitions/candidature.given';
import { importerCandidaturePériodeLegacy } from '../../../candidature/stepDefinitions/candidatureLegacy.given';

EtantDonné('le projet éliminé {string}', async function (this: PotentielWorld, nomProjet: string) {
  await importerCandidature.call(this, { nomProjet, statut: 'éliminé' });

  const dateDésignation = this.éliminéWorld.dateDésignation;

  await notifierÉliminé.call(this, dateDésignation);
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
      : this.éliminéWorld.dateDésignation;

    await notifierÉliminé.call(this, dateDésignation);
  },
);

EtantDonné(
  'le projet éliminé legacy {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();

    await importerCandidaturePériodeLegacy.call(this, nomProjet, 'éliminé', exemple);

    const dateDésignation = this.éliminéWorld.dateDésignation;

    await notifierÉliminé.call(this, dateDésignation);
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

  this.éliminéWorld.notifierEliminéFixture.créer({
    notifiéPar: this.utilisateurWorld.validateurFixture.email,
    ...(dateDésignation ? { notifiéLe: dateDésignation } : {}),
  });

  this.éliminéWorld.identifiantProjet = identifiantProjetValue;

  this.éliminéWorld.éliminéFixtures.set(candidature.values.nomProjetValue, {
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
      identifiantProjetValue: identifiantProjetValue.formatter(),
      identifiantUtilisateurValue: candidature.values.emailContactValue,
      autoriséLeValue: dateDésignation,
      autoriséParValue: Email.system().formatter(),
      raison: 'notification',
    },
  });
}
