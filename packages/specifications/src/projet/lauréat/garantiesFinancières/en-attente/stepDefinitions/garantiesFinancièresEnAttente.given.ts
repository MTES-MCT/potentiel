import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { sleep } from '../../../../../helpers/sleep';
import { PotentielWorld } from '../../../../../potentiel.world';
import {
  getCommonGarantiesFinancièresData,
  getGarantiesFinancièresActuellesEnAttenteData,
} from '../../helpers';

EtantDonné(
  `des garanties financières en attente pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const { identifiantProjetValue } = getCommonGarantiesFinancièresData(
      identifiantProjet,
      exemple,
    );

    const { demandéLeValue, dateLimiteSoumissionValue, motifValue } =
      getGarantiesFinancièresActuellesEnAttenteData(exemple);

    await mediator.send<GarantiesFinancières.DemanderGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
      data: {
        identifiantProjetValue,
        demandéLeValue,
        dateLimiteSoumissionValue,
        motifValue,
      },
    });

    await sleep(500);
  },
);
