import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../../../potentiel.world';
import { sleep } from '../../../../helpers/sleep';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

Quand(
  'le porteur demande la levée des garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const motif = exemple['motif'] || 'projet-abandonné';
      const utilisateur = exemple['utilisateur'] || 'user@test.test';
      const dateDemande = exemple['date demande'] || '2024-01-01';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.DemanderMainLevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.MainLevée.UseCase.Demander',
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
  'le porteur annule la demande de main-levée des garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const annulationData = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
      const utilisateur = annulationData['utilisateur'] || 'user@test.test';
      const date = annulationData['date annulation'] || '2024-01-01';

      await mediator.send<GarantiesFinancières.AnnulerMainLevéeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.MainLevée.UseCase.Annuler',
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
