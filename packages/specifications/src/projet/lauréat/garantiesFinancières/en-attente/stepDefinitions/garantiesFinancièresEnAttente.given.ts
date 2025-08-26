import { Given as EtantDonné } from '@cucumber/cucumber';

import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat, ProjetAggregateRoot } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { AppelOffreAdapter } from '@potentiel-infrastructure/domain-adapters';

import { PotentielWorld } from '../../../../../potentiel.world';

EtantDonné(
  `des garanties financières en attente pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { motif, dateLimiteSoumission, demandéLe } =
      this.lauréatWorld.garantiesFinancièresWorld.actuelles.demander.créer();

    // on accède directement à l'aggregate root car il n'y a pas de commande pour Demander, qui réagit à d'autres actions
    const projet = await ProjetAggregateRoot.get(this.lauréatWorld.identifiantProjet, {
      loadAggregate: loadAggregateV2,
      loadAppelOffreAggregate: AppelOffreAdapter.loadAppelOffreAggregateAdapter,
    });

    await projet.lauréat.garantiesFinancières.demander({
      demandéLe: DateTime.convertirEnValueType(demandéLe),
      motif:
        Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.convertirEnValueType(motif),
      dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
    });
  },
);
