import { When as Quand } from '@cucumber/cucumber';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { PotentielWorld } from '../../../../../potentiel.world';

Quand(
  `un admin efface l'historique des garanties financières pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const event: Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent = {
        type: 'HistoriqueGarantiesFinancièresEffacé-V1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          effacéLe: DateTime.now().formatter(),
          effacéPar: Email.system().formatter(),
        },
      };
      await publish(`garanties-financieres|${identifiantProjet.formatter()}`, event);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
