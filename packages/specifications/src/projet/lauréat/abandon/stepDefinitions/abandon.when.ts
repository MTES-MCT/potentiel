import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';
import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';
import { DateTime, IdentifiantUtilisateur } from '@potentiel-domain/common';

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
      const utilisateur = 'porteur@test.test';

      this.lauréatWorld.abandonWorld.raison = raison;
      this.lauréatWorld.abandonWorld.recandidature = recandidature;
      this.lauréatWorld.abandonWorld.dateDemande = DateTime.convertirEnValueType(dateDemande);
      this.lauréatWorld.abandonWorld.pièceJustificative = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(utilisateur);

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
          utilisateurValue: utilisateur,
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
        type: 'DEMANDER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          raisonValue: `La raison de l'abandon`,
          recandidatureValue: false,
          dateDemandeValue: new Date().toISOString(),
          utilisateurValue: 'porteur@test.test',
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
      const utilisateur = 'porteur@test.test';

      this.lauréatWorld.abandonWorld.dateAnnulation = DateTime.convertirEnValueType(dateAnnulation);
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(utilisateur);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'ANNULER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAnnulationValue: dateAnnulation.toISOString(),
          utilisateurValue: utilisateur,
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
      const utilisateur = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.dateRejet = DateTime.convertirEnValueType(dateRejet);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format: 'text/plain',
        content: `Le contenu de la réponse signée`,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(utilisateur);

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
          utilisateurValue: utilisateur,
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
      const utilisateur = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.dateRejet = DateTime.convertirEnValueType(dateRejet);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(utilisateur);

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
          utilisateurValue: utilisateur,
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
      const dateAccord = new Date();
      const utilisateur = 'validateur@test.test';

      this.lauréatWorld.abandonWorld.dateAccord = DateTime.convertirEnValueType(dateAccord);
      this.lauréatWorld.abandonWorld.réponseSignée = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(utilisateur);

      const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'ACCORDER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
          dateAccordValue: dateAccord.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(content),
            format,
          },
          utilisateurValue: utilisateur,
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
      const utilisateur = 'validateur@test.test';

      const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'ACCORDER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
          dateAccordValue: dateAccord.toISOString(),
          réponseSignéeValue: {
            content: convertStringToReadableStream(`Le contenu de la réponse signée`),
            format: 'text/plain',
          },
          utilisateurValue: utilisateur,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
