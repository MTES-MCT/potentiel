import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../../../potentiel.world';
import { sleep } from '../../../../helpers/sleep';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

Quand(
  'le porteur demande la levée des garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const motif = exemple['motif'] || 'projet-abandonné';
      const utilisateur = exemple['utilisateur'] || 'user@test.test';
      const dateDemande = exemple['date demande'] || '2024-01-01';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          motifValue: motif,
          demandéLeValue: new Date(dateDemande).toISOString(),
          demandéParValue: utilisateur,
        },
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
      const utilisateur = annulationData['utilisateur'] || 'user@test.test';
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
      const utilisateur = exemple['utilisateur'] || 'user@test.test';
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
  `un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const utilisateur = exemple['utilisateur'] || 'user@test.test';
      const date = exemple['date'] || '2024-01-01';
      const content = exemple['contenu fichier réponse'] || 'le contenu du fichier';
      const format = exemple['format fichier réponse'] || 'application/pdf';

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
      const utilisateur = 'user@test.test';
      const date = '2024-01-01';
      const content = 'le contenu du fichier';
      const format = 'application/pdf';

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
            format: 'application/pdf',
            content: convertStringToReadableStream('contenu'),
          },
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
