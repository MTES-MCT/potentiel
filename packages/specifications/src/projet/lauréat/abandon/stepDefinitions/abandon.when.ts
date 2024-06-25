import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Abandon } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

Quand(
  `le porteur demande l'abandon pour le projet lauréat {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const raison = exemple[`La raison de l'abandon`] ?? `La raison de l'abandon`;
      const format = exemple[`Le format de la pièce justificative`] ?? undefined;
      const content = exemple[`Le contenu de la pièce justificative`] ?? undefined;
      const recandidature = exemple[`Recandidature`] === 'oui';
      const dateDemande = new Date();
      const email = 'porteur@test.test';

      this.lauréatWorld.abandonWorld.raison = raison;
      this.lauréatWorld.abandonWorld.recandidature = recandidature;
      this.lauréatWorld.abandonWorld.dateDemande = DateTime.convertirEnValueType(dateDemande);
      this.lauréatWorld.abandonWorld.pièceJustificative = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          raisonValue: raison,
          pièceJustificativeValue: format
            ? {
                content: convertStringToReadableStream(content),
                format,
              }
            : undefined,
          recandidatureValue: recandidature,
          dateDemandeValue: dateDemande.toISOString(),
          identifiantUtilisateurValue: email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le porteur demande l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          raisonValue: `La raison de l'abandon`,
          recandidatureValue: false,
          dateDemandeValue: new Date().toISOString(),
          identifiantUtilisateurValue: 'porteur@test.test',
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le porteur annule l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const dateAnnulation = new Date();
      const email = 'porteur@test.test';

      this.lauréatWorld.abandonWorld.dateAnnulation = DateTime.convertirEnValueType(dateAnnulation);
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.AnnulerAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAnnulationValue: dateAnnulation.toISOString(),
          identifiantUtilisateurValue: email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur rejette l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const dateRejet = new Date();
      const email = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.dateRejet = DateTime.convertirEnValueType(dateRejet);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format: 'text/plain',
        content: `Le contenu de la réponse signée`,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.RejeterAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateRejetValue: dateRejet.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(`Le contenu de la réponse signée`),
            format: `text/plain`,
          },
          identifiantUtilisateurValue: email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur rejette l'abandon pour le projet lauréat {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const format = exemple[`Le format de la réponse signée`] ?? `Le format de la réponse signée`;
      const content =
        exemple[`Le contenu de la réponse signée`] ?? `Le contenu de la réponse signée`;
      const dateRejet = new Date();
      const email = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.dateRejet = DateTime.convertirEnValueType(dateRejet);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.RejeterAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateRejetValue: dateRejet.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(content),
            format,
          },
          identifiantUtilisateurValue: email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur accorde l'abandon pour le projet lauréat {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const format = exemple[`Le format de la réponse signée`] ?? `Le format de la réponse signée`;
      const content =
        exemple[`Le contenu de la réponse signée`] ?? `Le contenu de la réponse signée`;
      const dateAccord = DateTime.now();
      const email = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.dateAccord = dateAccord;
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);
      this.lauréatWorld.abandonWorld.dateDemandePreuveRecandidature = dateAccord;

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAccordValue: dateAccord.formatter(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(content),
            format,
          },
          identifiantUtilisateurValue: email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur accorde l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const dateAccord = new Date();
      const email = 'validateur@test.test';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAccordValue: dateAccord.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(`Le contenu de la réponse signée`),
            format: 'text/plain',
          },
          identifiantUtilisateurValue: email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur annule le rejet de l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const dateAnnulation = new Date();
      const email = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.dateAnnulation = DateTime.convertirEnValueType(dateAnnulation);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.AnnulerRejetAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAnnulationValue: dateAnnulation.toISOString(),
          identifiantUtilisateurValue: email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur demande une confirmation d'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const dateDemandeConfirmation = new Date();
      const email = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.dateDemandeConfirmation =
        DateTime.convertirEnValueType(dateDemandeConfirmation);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format: 'text/plain',
        content: `Le contenu de la réponse signée`,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateDemandeValue: dateDemandeConfirmation.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(`Le contenu de la réponse signée`),
            format: `text/plain`,
          },
          identifiantUtilisateurValue: email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur demande une confirmation d'abandon pour le projet lauréat {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const format = exemple[`Le format de la réponse signée`] ?? `Le format de la réponse signée`;
      const content =
        exemple[`Le contenu de la réponse signée`] ?? `Le contenu de la réponse signée`;
      const dateDemandeConfirmation = new Date();
      const email = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.dateDemandeConfirmation =
        DateTime.convertirEnValueType(dateDemandeConfirmation);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateDemandeValue: dateDemandeConfirmation.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(content),
            format,
          },
          identifiantUtilisateurValue: email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le porteur confirme l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const dateConfirmation = new Date();
      const email = 'porteur@test.test';

      this.lauréatWorld.abandonWorld.dateConfirmation =
        DateTime.convertirEnValueType(dateConfirmation);
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.ConfirmerAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateConfirmationValue: dateConfirmation.toISOString(),
          identifiantUtilisateurValue: email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le porteur transmet le projet {lauréat-éliminé} {string} comme preuve de recandidature suite à l'abandon du projet {string} avec :`,
  async function (
    this: PotentielWorld,
    statutProjet: 'lauréat' | 'éliminé',
    preuveRecandidature: string,
    projetAbandonné: string,
    table: DataTable,
  ) {
    try {
      const exemple = table.rowsHash();
      const dateNotificationProjet = exemple['La date de notification du projet'] ?? '01/01/2024';
      const dateTransmissionPreuveRecandidature = DateTime.convertirEnValueType(
        new Date('2024-01-24').toISOString(),
      );

      const { identifiantProjet: identifiantProjetAbandonné } =
        this.lauréatWorld.rechercherLauréatFixture(projetAbandonné);
      const { identifiantProjet: identifiantProjetPreuveRecandidature } =
        statutProjet === 'lauréat'
          ? this.lauréatWorld.rechercherLauréatFixture(preuveRecandidature)
          : this.eliminéWorld.rechercherEliminéFixture(preuveRecandidature);

      const email = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.preuveRecandidature = identifiantProjetPreuveRecandidature;
      this.lauréatWorld.abandonWorld.dateTransmissionPreuveRecandidature =
        dateTransmissionPreuveRecandidature;
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
        data: {
          dateNotificationValue: new Date(dateNotificationProjet).toISOString(),
          identifiantProjetValue: identifiantProjetAbandonné.formatter(),
          preuveRecandidatureValue: identifiantProjetPreuveRecandidature.formatter(),
          identifiantUtilisateurValue: email,
          dateTransmissionPreuveRecandidatureValue: dateTransmissionPreuveRecandidature.formatter(),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur relance à la date du {string} le porteur du projet {string} pour qu'il transmettre une preuve de recandidature`,
  async function (this: PotentielWorld, dateDeRelance: string, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateDemandeValue: new Date(dateDeRelance).toISOString(),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  /le DGEC validateur demande au porteur du projet "(.*)" de transmettre une preuve de recandidature(.*)/,
  async function (this: PotentielWorld, nomProjet: string, dateLimite: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
      const dateDemande = DateTime.convertirEnValueType(
        dateLimite.trim() === 'à la date du 01/04/2025' ? new Date('2025-04-01') : new Date(),
      );
      this.lauréatWorld.abandonWorld.dateDemandePreuveRecandidature = dateDemande;

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateDemandeValue: dateDemande.formatter(),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
