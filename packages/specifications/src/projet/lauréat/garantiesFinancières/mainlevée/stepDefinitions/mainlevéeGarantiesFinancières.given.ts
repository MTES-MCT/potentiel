import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';
import { waitForEvents } from '../../../../../helpers/waitForEvents';

import {
  setAccordMainlevéeData,
  setDemandeMainlevéeData,
  setInstructionDemandeMainlevéeData,
  setRejetMainlevéeData,
} from './helper';

EtantDonné(
  'une demande de mainlevée de garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const motif = exemple['motif'];
    const utilisateur = exemple['utilisateur'];
    const date = exemple['date demande'];
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
      data: setDemandeMainlevéeData({ motif, utilisateur, date, identifiantProjet }),
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
    await waitForEvents();

    await mediator.send<GarantiesFinancières.DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase>(
      {
        type: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.DémarrerInstruction',
        data: setInstructionDemandeMainlevéeData({ identifiantProjet }),
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
      data: setAccordMainlevéeData({ identifiantProjet }),
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
      data: setRejetMainlevéeData({ identifiantProjet }),
    });
  },
);
