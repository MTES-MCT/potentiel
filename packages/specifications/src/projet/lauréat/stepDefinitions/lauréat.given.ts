import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Accès, CahierDesCharges, Lauréat } from '@potentiel-domain/projet';
import { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PotentielWorld } from '../../../potentiel.world';
import { importerCandidature } from '../../../candidature/stepDefinitions/candidature.given';

import { choisirCahierDesCharges } from './lauréat.when';

EtantDonné('le projet lauréat {string}', async function (this: PotentielWorld, nomProjet: string) {
  await importerCandidature.call(this, { nomProjet, statut: 'classé' });

  const dateDésignation = this.lauréatWorld.dateDésignation;

  await notifierLauréat.call(this, dateDésignation);
});

EtantDonné(
  'le projet lauréat {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();

    await importerCandidature.call(this, {
      nomProjet,
      statut: 'classé',
      ...this.candidatureWorld.mapExempleToFixtureValues(exemple),
    });

    const dateDésignation = exemple['date notification']
      ? new Date(exemple['date notification']).toISOString()
      : this.lauréatWorld.dateDésignation;

    await notifierLauréat.call(this, dateDésignation);
  },
);

EtantDonné(
  'le projet lauréat sans garanties financières importées {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const dateDésignation = this.lauréatWorld.dateDésignation;

      await importerCandidature.call(this, {
        nomProjet,
        statut: 'classé',
        dépôt: { typeGarantiesFinancières: undefined, dateÉchéanceGf: undefined },
        // PPE2 Innovation n'est pas soumis aux GF,
        // donc permet l'import d'une candidature sans type de GF
        identifiantProjet: {
          appelOffre: 'PPE2 - Innovation',
          période: '1',
        },
      });

      await notifierLauréat.call(this, dateDésignation);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
EtantDonné(
  'un cahier des charges permettant la modification du projet',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const appelOffre = appelsOffreData.find((ao) => ao.id === identifiantProjet.appelOffre)!;
    const période = appelOffre?.periodes.find((p) => p.id === identifiantProjet.période);
    if (!période) {
      throw new Error('Données invalides - période non trouvée');
    }
    const cdc = CahierDesCharges.bind({
      appelOffre,
      période,
      cahierDesChargesModificatif: undefined,
      // famille et technologie n'ont pas d'influence dans ce contexte
      famille: période.familles?.[0],
      technologie: undefined,
    });

    if (cdc.doitChoisirUnCahierDesChargesModificatif()) {
      await choisirCahierDesCharges.call(
        this,
        AppelOffre.RéférenceCahierDesCharges.bind(
          période.cahiersDesChargesModifiésDisponibles[0]!,
        ).formatter(),
      );
    }
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
      identifiantProjetValue: identifiantProjetValue.formatter(),
      identifiantUtilisateurValue: candidature.values.emailContactValue,
      autoriséLeValue: dateDésignation,
      autoriséParValue: Email.system().formatter(),
      raison: 'notification',
    },
  });
}
