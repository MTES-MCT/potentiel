import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';
import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { createToken } from '../../../../helpers/createToken';

Quand(
  `{string} demande l'abandon pour le projet lauréat {string} avec :`,
  async function (this: PotentielWorld, role: string, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const raison = exemple[`La raison de l'abandon`] ?? `La raison de l'abandon`;
      const format = exemple[`Le format de la pièce justificative`] ?? undefined;
      const content = exemple[`Le contenu de la pièce justificative`] ?? undefined;
      const recandidature = exemple[`Recandidature`] === 'oui';
      const dateDemande = new Date();
      const email = 'porteur@test.test';

      const accessToken = createToken({
        email: 'porteur@test.test',
        role,
      });

      this.lauréatWorld.abandonWorld.raison = raison;
      this.lauréatWorld.abandonWorld.recandidature = recandidature;
      this.lauréatWorld.abandonWorld.dateDemande = DateTime.convertirEnValueType(dateDemande);
      this.lauréatWorld.abandonWorld.pièceJustificative = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);
      this.accessToken = accessToken;

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'DEMANDER_ABANDON_USECASE',
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
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `{string} demande l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, role: string, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const accessToken = createToken({
        email: 'porteur@test.test',
        role,
      });

      this.accessToken = accessToken;

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'DEMANDER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          raisonValue: `La raison de l'abandon`,
          recandidatureValue: false,
          dateDemandeValue: new Date().toISOString(),
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `{string} annule l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, role: string, nomProjet: string) {
    try {
      const dateAnnulation = new Date();
      const email = 'porteur@test.test';

      const accessToken = createToken({
        email,
        role,
      });

      this.accessToken = accessToken;

      this.lauréatWorld.abandonWorld.dateAnnulation = DateTime.convertirEnValueType(dateAnnulation);
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'ANNULER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAnnulationValue: dateAnnulation.toISOString(),
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `{string} rejette l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, role: string, nomProjet: string) {
    try {
      const dateRejet = new Date();
      const email = 'validateur@test.test';
      const accessToken = createToken({
        role,
        email,
      });

      this.lauréatWorld.abandonWorld.dateRejet = DateTime.convertirEnValueType(dateRejet);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format: 'text/plain',
        content: `Le contenu de la réponse signée`,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);
      this.accessToken = accessToken;

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'REJETER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateRejetValue: dateRejet.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(`Le contenu de la réponse signée`),
            format: `text/plain`,
          },
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `{string} rejette l'abandon pour le projet lauréat {string} avec :`,
  async function (this: PotentielWorld, role: string, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const format = exemple[`Le format de la réponse signée`] ?? `Le format de la réponse signée`;
      const content =
        exemple[`Le contenu de la réponse signée`] ?? `Le contenu de la réponse signée`;
      const dateRejet = new Date();
      const email = 'validateur@test.test';
      const accessToken = createToken({
        role,
        email,
      });

      this.lauréatWorld.abandonWorld.dateRejet = DateTime.convertirEnValueType(dateRejet);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);
      this.accessToken = accessToken;

      const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'REJETER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
          dateRejetValue: dateRejet.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(content),
            format,
          },
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `{string} accorde l'abandon pour le projet lauréat {string} avec :`,
  async function (this: PotentielWorld, role: string, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const format = exemple[`Le format de la réponse signée`] ?? `Le format de la réponse signée`;
      const content =
        exemple[`Le contenu de la réponse signée`] ?? `Le contenu de la réponse signée`;
      const dateAccord = DateTime.now();
      const email = 'validateur@test.test';

      const accessToken = createToken({
        email,
        role,
      });

      this.lauréatWorld.abandonWorld.dateAccord = dateAccord;
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);
      this.accessToken = accessToken;
      this.lauréatWorld.abandonWorld.dateDemandePreuveRecandidature = dateAccord;

      const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'ACCORDER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
          dateAccordValue: dateAccord.formatter(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(content),
            format,
          },
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `{string} accorde l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, role: string, nomProjet: string) {
    try {
      const dateAccord = new Date();
      const email = 'validateur@test.test';

      const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const accessToken = createToken({
        email,
        role,
      });

      this.accessToken = accessToken;

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'ACCORDER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
          dateAccordValue: dateAccord.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(`Le contenu de la réponse signée`),
            format: 'text/plain',
          },
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `{string} annule le rejet de l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, role: string, nomProjet: string) {
    try {
      const dateAnnulation = new Date();
      const email = 'validateur@test.test';
      const accessToken = createToken({
        email,
        role,
      });

      this.lauréatWorld.abandonWorld.dateAnnulation = DateTime.convertirEnValueType(dateAnnulation);
      this.accessToken = accessToken;

      const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'ANNULER_REJET_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
          dateAnnulationValue: dateAnnulation.toISOString(),
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `{string} demande une confirmation d'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, role: string, nomProjet: string) {
    try {
      const dateDemandeConfirmation = new Date();
      const email = 'validateur@test.test';
      const accessToken = createToken({
        email,
        role,
      });

      this.lauréatWorld.abandonWorld.dateDemandeConfirmation =
        DateTime.convertirEnValueType(dateDemandeConfirmation);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format: 'text/plain',
        content: `Le contenu de la réponse signée`,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);
      this.accessToken = accessToken;

      const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
          dateDemandeValue: dateDemandeConfirmation.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(`Le contenu de la réponse signée`),
            format: `text/plain`,
          },
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `{string} demande une confirmation d'abandon pour le projet lauréat {string} avec :`,
  async function (this: PotentielWorld, role: string, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const format = exemple[`Le format de la réponse signée`] ?? `Le format de la réponse signée`;
      const content =
        exemple[`Le contenu de la réponse signée`] ?? `Le contenu de la réponse signée`;
      const dateDemandeConfirmation = new Date();
      const email = 'validateur@test.test';
      const accessToken = createToken({
        email,
        role,
      });

      this.lauréatWorld.abandonWorld.dateDemandeConfirmation =
        DateTime.convertirEnValueType(dateDemandeConfirmation);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);
      this.accessToken = accessToken;

      const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
          dateDemandeValue: dateDemandeConfirmation.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(content),
            format,
          },
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `{string} confirme l'abandon pour le projet lauréat {string}`,
  async function (this: PotentielWorld, role: string, nomProjet: string) {
    try {
      const dateConfirmation = new Date();
      const email = 'porteur@test.test';
      const accessToken = createToken({
        email,
        role,
      });

      this.lauréatWorld.abandonWorld.dateConfirmation =
        DateTime.convertirEnValueType(dateConfirmation);
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);
      this.accessToken = accessToken;

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'CONFIRMER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateConfirmationValue: dateConfirmation.toISOString(),
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le porteur transmet le projet éliminé {string} comme preuve de recandidature suite à l'abandon du projet {string} avec :`,
  async function (
    this: PotentielWorld,
    preuveRecandidature: string,
    projetAbandonné: string,
    table: DataTable,
  ) {
    try {
      const exemple = table.rowsHash();
      const dateNotificationProjet = exemple['La date de notification du projet'] ?? '01/01/2024';

      const { identitiantProjetValueType: identifiantProjetAbandonné } =
        this.lauréatWorld.rechercherLauréatFixture(projetAbandonné);
      const { identitiantProjetValueType: identifiantProjetPreuveRecandidature } =
        this.lauréatWorld.rechercherLauréatFixture(preuveRecandidature);
      const utilisateur = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.preuveRecandidature = identifiantProjetPreuveRecandidature;

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE',
        data: {
          dateNotificationValue: new Date(dateNotificationProjet).toISOString(),
          identifiantProjetValue: identifiantProjetAbandonné.formatter(),
          preuveRecandidatureValue: identifiantProjetPreuveRecandidature.formatter(),
          utilisateurValue: utilisateur,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le porteur transmet le projet lauréat {string} comme preuve de recandidature suite à l'abandon du projet {string} avec :`,
  async function (
    this: PotentielWorld,
    preuveRecandidature: string,
    projetAbandonné: string,
    table: DataTable,
  ) {
    try {
      const exemple = table.rowsHash();
      const dateNotificationProjet = exemple['La date de notification du projet'] ?? '01/01/2024';

      const { identitiantProjetValueType: identifiantProjetAbandonné } =
        this.lauréatWorld.rechercherLauréatFixture(projetAbandonné);
      const { identitiantProjetValueType: identifiantProjetPreuveRecandidature } =
        this.lauréatWorld.rechercherLauréatFixture(preuveRecandidature);
      const utilisateur = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.preuveRecandidature = identifiantProjetPreuveRecandidature;

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE',
        data: {
          dateNotificationValue: new Date(dateNotificationProjet).toISOString(),
          identifiantProjetValue: identifiantProjetAbandonné.formatter(),
          preuveRecandidatureValue: identifiantProjetPreuveRecandidature.formatter(),
          utilisateurValue: utilisateur,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  /"(.*)" demande au porteur du projet "(.*)" de transmettre une preuve de recandidature(.*)/,
  async function (this: PotentielWorld, role: string, nomProjet: string, dateLimite: string) {
    try {
      const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
      const dateDemande = DateTime.convertirEnValueType(
        dateLimite.trim() === 'à la date du 01/04/2025' ? new Date('2025-04-01') : new Date(),
      );
      const email = 'validateur@test.test';
      const accessToken = createToken({
        email,
        role,
      });

      this.lauréatWorld.abandonWorld.dateDemandePreuveRecandidature = dateDemande;
      this.accessToken = accessToken;

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'DEMANDER_PREUVE_RECANDIDATURE_USECASE',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
          dateDemandeValue: dateDemande.formatter(),
          utilisateurValue: accessToken,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
