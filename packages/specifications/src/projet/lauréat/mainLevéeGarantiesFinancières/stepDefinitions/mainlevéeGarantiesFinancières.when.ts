import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';
import { sleep } from '../../../../helpers/sleep';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

import {
  defaultDocumentContenu,
  defaultDocumentFormat,
  defaultUtilisateur,
  setDemandeMainlevéeData,
} from './helper';

Quand(
  'le porteur demande la levée des garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const motif = exemple['motif'];
      const utilisateur = exemple['utilisateur'];
      const dateDemande = exemple['date demande'];

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
        data: setDemandeMainlevéeData({ motif, utilisateur, dateDemande, identifiantProjet }),
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur annule la demande de mainlevée des garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const annulationData = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
      const utilisateur = annulationData['utilisateur'] || defaultUtilisateur;
      const date = annulationData['date annulation'] || '2024-01-01';

      await mediator.send<GarantiesFinancières.AnnulerMainlevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Annuler',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          annuléLeValue: new Date(date).toISOString(),
          annuléParValue: utilisateur,
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières du projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const utilisateur = exemple['utilisateur'] || defaultUtilisateur;
      const date = exemple['date'] || '2024-01-01';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase>(
        {
          type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.DémarrerInstruction',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            démarréLeValue: new Date(date).toISOString(),
            démarréParValue: utilisateur,
          },
        },
      );
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal démarre l'instruction de la demande de mainlevée des garanties financières du projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const utilisateur = defaultUtilisateur;
      const date = '2024-01-01';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase>(
        {
          type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.DémarrerInstruction',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            démarréLeValue: new Date(date).toISOString(),
            démarréParValue: utilisateur,
          },
        },
      );
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const utilisateur = exemple['utilisateur'] || defaultUtilisateur;
      const date = exemple['date'] || '2024-01-01';
      const content = exemple['contenu fichier réponse'] || defaultDocumentContenu;
      const format = exemple['format fichier réponse'] || defaultDocumentFormat;

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.AccorderDemandeMainlevéeGarantiesFinancièresUseCase>(
        {
          type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            accordéLeValue: new Date(date).toISOString(),
            accordéParValue: utilisateur,
            réponseSignéeValue: { format, content: convertStringToReadableStream(content) },
          },
        },
      );
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const utilisateur = defaultUtilisateur;
      const date = '2024-01-01';
      const content = defaultDocumentContenu;
      const format = defaultDocumentFormat;

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.AccorderDemandeMainlevéeGarantiesFinancièresUseCase>(
        {
          type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            accordéLeValue: new Date(date).toISOString(),
            accordéParValue: utilisateur,
            réponseSignéeValue: { format, content: convertStringToReadableStream(content) },
          },
        },
      );
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const utilisateur = exemple['utilisateur'];
      const date = exemple['date'];
      const content = exemple['contenu fichier réponse'];
      const format = exemple['format fichier réponse'];

      await mediator.send<GarantiesFinancières.RejeterDemandeMainlevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.RejeterDemandeMainlevée',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          rejetéLeValue: new Date(date).toISOString(),
          rejetéParValue: utilisateur,
          réponseSignéeValue: { format, content: convertStringToReadableStream(content) },
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur Dreal rejette une demande de mainlevée des garanties financières du projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.RejeterDemandeMainlevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.RejeterDemandeMainlevée',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          rejetéLeValue: new Date('2024-06-12').toISOString(),
          rejetéParValue: 'dreal@test.test',
          réponseSignéeValue: {
            format: defaultDocumentFormat,
            content: convertStringToReadableStream('contenu'),
          },
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
