import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../../../potentiel.world';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

EtantDonné(
  'une demande de mainlevée de garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

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
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières en instruction pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        motifValue: 'projet-achevé',
        demandéLeValue: new Date('2024-05-01').toISOString(),
        demandéParValue: 'porteur@test.test',
      },
    });

    await mediator.send<GarantiesFinancières.DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase>(
      {
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.DémarrerInstruction',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          démarréLeValue: new Date('2024-05-10').toISOString(),
          démarréParValue: 'dreal@test.test',
        },
      },
    );
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières accordée pour le projet {string} achevé',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        motifValue: 'projet-achevé',
        demandéLeValue: new Date('2024-05-01').toISOString(),
        demandéParValue: 'porteur@test.test',
      },
    });

    await mediator.send<GarantiesFinancières.AccorderDemandeMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        accordéLeValue: new Date('2024-05-10').toISOString(),
        accordéParValue: 'porteur@test.test',
        réponseSignéeValue: {
          format: 'application/pdf',
          content: convertStringToReadableStream('contenu'),
        },
      },
    });
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières rejetée pour le projet {string} achevé',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        motifValue: 'projet-achevé',
        demandéLeValue: new Date('2024-05-01').toISOString(),
        demandéParValue: 'porteur@test.test',
      },
    });

    await mediator.send<GarantiesFinancières.RejeterDemandeMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.RejeterDemandeMainlevée',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        rejetéLeValue: new Date('2024-05-10').toISOString(),
        rejetéParValue: 'porteur@test.test',
        réponseSignéeValue: {
          format: 'application/pdf',
          content: convertStringToReadableStream('contenu'),
        },
      },
    });
  },
);
