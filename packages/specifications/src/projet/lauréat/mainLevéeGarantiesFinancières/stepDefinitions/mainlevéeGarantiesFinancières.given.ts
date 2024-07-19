import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

import { defaultDateRejetOuAccord, setDemandeMainlevéeData } from './helper';

EtantDonné(
  'une demande de mainlevée de garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const motif = exemple['motif'];
    const utilisateur = exemple['utilisateur'];
    const dateDemande = exemple['date demande'];
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
      data: setDemandeMainlevéeData({ motif, utilisateur, dateDemande, identifiantProjet }),
    });
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières en instruction pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
      data: setDemandeMainlevéeData({ identifiantProjet }),
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
      data: setDemandeMainlevéeData({ identifiantProjet }),
    });

    await mediator.send<GarantiesFinancières.AccorderDemandeMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        accordéLeValue: new Date(defaultDateRejetOuAccord).toISOString(),
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
      data: setDemandeMainlevéeData({ identifiantProjet }),
    });

    await mediator.send<GarantiesFinancières.RejeterDemandeMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.RejeterDemandeMainlevée',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        rejetéLeValue: new Date(defaultDateRejetOuAccord).toISOString(),
        rejetéParValue: 'porteur@test.test',
        réponseSignéeValue: {
          format: 'application/pdf',
          content: convertStringToReadableStream('contenu'),
        },
      },
    });
  },
);
