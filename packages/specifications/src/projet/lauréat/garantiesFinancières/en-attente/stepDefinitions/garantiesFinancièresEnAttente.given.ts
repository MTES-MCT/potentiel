import { Given as EtantDonné } from '@cucumber/cucumber';

import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../../potentiel.world';

EtantDonné(
  `des garanties financières en attente pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { motif, dateLimiteSoumission, demandéLe } =
      this.lauréatWorld.garantiesFinancièresWorld.actuelles.demander.créer();

    const event: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent = {
      type: 'GarantiesFinancièresDemandées-V1',
      payload: {
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        motif:
          Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.convertirEnValueType(motif)
            .motif,
        dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission).formatter(),
        demandéLe: DateTime.convertirEnValueType(demandéLe).formatter(),
      },
    };
    await publish(`garanties-financieres|${event.payload.identifiantProjet}`, event);
  },
);
