import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

import { setDépôtData } from './helper';

EtantDonné(
  'un dépôt de garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: setDépôtData({
        exemple,
        identifiantProjet,
      }),
    });
  },
);

EtantDonné(
  'un dépôt de garanties financières pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: setDépôtData({
        identifiantProjet,
      }),
    });
  },
);
