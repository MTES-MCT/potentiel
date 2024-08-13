import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

Quand(
  `un admin efface l'historique des garanties financières pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.EffacerHistoriqueGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EffacerHistoriqueGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          effacéLeValue: new Date().toISOString(),
          effacéParValue: 'admin@test.test',
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
