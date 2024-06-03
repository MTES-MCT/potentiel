import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../../../potentiel.world';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

EtantDonné(
  'une demande de main-levée de garanties financières envoyée le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

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
  },
);
