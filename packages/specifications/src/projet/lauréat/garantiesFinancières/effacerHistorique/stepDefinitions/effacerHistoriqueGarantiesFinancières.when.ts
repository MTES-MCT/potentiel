import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';
import { sleep } from '../../../../../helpers/sleep';
import { getCommonGarantiesFinancièresData } from '../../helpers/getCommonGarantiesFinancièresData';

Quand(
  `un admin efface l'historique des garanties financières pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const { identifiantProjetValue, effacéLeValue, effacéParValue } =
        getCommonGarantiesFinancièresData(identifiantProjet, {});

      await mediator.send<GarantiesFinancières.EffacerHistoriqueGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EffacerHistoriqueGarantiesFinancières',
        data: {
          identifiantProjetValue,
          effacéLeValue,
          effacéParValue,
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
