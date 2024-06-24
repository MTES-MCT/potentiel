import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Recours } from '@potentiel-domain/elimine';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

Quand(
  `le porteur demande le recours pour le projet éliminé {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const raison = exemple[`La raison du recours`] ?? `La raison du recours`;
      const format = exemple[`Le format de la pièce justificative`] ?? undefined;
      const content = exemple[`Le contenu de la pièce justificative`] ?? undefined;
      const dateDemande = new Date();
      const email = 'porteur@test.test';

      this.eliminéWorld.recoursWorld.raison = raison;
      this.eliminéWorld.recoursWorld.dateDemande = DateTime.convertirEnValueType(dateDemande);
      this.eliminéWorld.recoursWorld.pièceJustificative = {
        format,
        content,
      };
      this.eliminéWorld.recoursWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Eliminé.Recours.UseCase.DemanderRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          raisonValue: raison,
          pièceJustificativeValue: format
            ? {
                content: convertStringToReadableStream(content),
                format,
              }
            : undefined,
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
  `le porteur demande le recours pour le projet éliminé {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Eliminé.Recours.UseCase.DemanderRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          raisonValue: `La raison du recours`,
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
  `le porteur annule le recours pour le projet éliminé {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const dateAnnulation = new Date();
      const email = 'porteur@test.test';

      this.eliminéWorld.recoursWorld.dateAnnulation = DateTime.convertirEnValueType(dateAnnulation);
      this.eliminéWorld.recoursWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Eliminé.Recours.UseCase.AnnulerRecours',
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
  `le DGEC validateur rejette le recours pour le projet éliminé {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const dateRejet = new Date();
      const email = 'validateur@test.test';

      this.eliminéWorld.recoursWorld.dateRejet = DateTime.convertirEnValueType(dateRejet);
      this.eliminéWorld.recoursWorld.réponseSignée = {
        format: 'text/plain',
        content: `Le contenu de la réponse signée`,
      };
      this.eliminéWorld.recoursWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Eliminé.Recours.UseCase.RejeterRecours',
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
  `le DGEC validateur rejette le recours pour le projet éliminé {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const format = exemple[`Le format de la réponse signée`] ?? `Le format de la réponse signée`;
      const content =
        exemple[`Le contenu de la réponse signée`] ?? `Le contenu de la réponse signée`;
      const dateRejet = new Date();
      const email = 'validateur@test.test';

      this.eliminéWorld.recoursWorld.dateRejet = DateTime.convertirEnValueType(dateRejet);
      this.eliminéWorld.recoursWorld.réponseSignée = {
        format,
        content,
      };
      this.eliminéWorld.recoursWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Eliminé.Recours.UseCase.RejeterRecours',
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
  `le DGEC validateur accorde le recours pour le projet éliminé {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const format = exemple[`Le format de la réponse signée`] ?? `Le format de la réponse signée`;
      const content =
        exemple[`Le contenu de la réponse signée`] ?? `Le contenu de la réponse signée`;
      const dateAccord = DateTime.now();
      const email = 'validateur@test.test';

      this.eliminéWorld.recoursWorld.dateAccord = dateAccord;
      this.eliminéWorld.recoursWorld.réponseSignée = {
        format,
        content,
      };
      this.eliminéWorld.recoursWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(email);

      const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Eliminé.Recours.UseCase.AccorderRecours',
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
  `le DGEC validateur accorde le recours pour le projet éliminé {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const dateAccord = new Date();
      const email = 'validateur@test.test';

      const { identifiantProjet } = this.eliminéWorld.rechercherEliminéFixture(nomProjet);

      await mediator.send<Recours.RecoursUseCase>({
        type: 'Eliminé.Recours.UseCase.AccorderRecours',
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
