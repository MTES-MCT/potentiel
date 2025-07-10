import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../../potentiel.world';

EtantDonné(
  `des garanties financières en attente pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const notifiéLe = exemple['date de notification'];
    const dateLimiteSoumission = exemple['date limite de soumission'];
    const motif = exemple['motif'];
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const event: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent = {
      type: 'GarantiesFinancièresDemandées-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        motif:
          Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.convertirEnValueType(motif)
            .motif,
        dateLimiteSoumission: DateTime.convertirEnValueType(
          new Date(dateLimiteSoumission),
        ).formatter(),
        demandéLe: DateTime.convertirEnValueType(new Date(notifiéLe)).formatter(),
      },
    };
    await publish(`garanties-financieres|${identifiantProjet.formatter()}`, event);
  },
);
