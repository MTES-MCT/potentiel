import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { sleep } from '../../../../../helpers/sleep';
import { PotentielWorld } from '../../../../../potentiel.world';
import { getDépôtGarantiesFinancièresData } from '../../helpers/getDépôtGarantiesFinancièresData';
import { getCommonGarantiesFinancièresData } from '../../helpers';

EtantDonné(
  'un dépôt de garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const {
      identifiantProjetValue,
      typeValue,
      dateConstitutionValue,
      dateÉchéanceValue,
      attestationValue,
    } = getCommonGarantiesFinancièresData(identifiantProjet, exemple);

    const { soumisLeValue, soumisParValue } = getDépôtGarantiesFinancièresData(exemple);

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: {
        identifiantProjetValue,
        typeValue,
        dateÉchéanceValue,
        dateConstitutionValue,
        attestationValue,
        soumisLeValue,
        soumisParValue,
      },
    });

    await sleep(500);
  },
);

EtantDonné(
  'un dépôt de garanties financières pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const { identifiantProjetValue, typeValue, dateConstitutionValue, attestationValue } =
      getCommonGarantiesFinancièresData(identifiantProjet, {});

    const { soumisLeValue, soumisParValue } = getDépôtGarantiesFinancièresData({});

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: {
        identifiantProjetValue,
        typeValue,
        dateConstitutionValue,
        soumisLeValue,
        soumisParValue,
        attestationValue,
      },
    });

    await sleep(500);
  },
);
