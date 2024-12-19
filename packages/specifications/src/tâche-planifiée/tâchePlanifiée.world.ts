import { match } from 'ts-pattern';

import { GarantiesFinancières, ReprésentantLégal } from '@potentiel-domain/laureat';
import { StatutTâchePlanifiée } from '@potentiel-domain/tache-planifiee';

export type RechercherTypeTâchePlanifiée =
  | 'échoir les garanties financières'
  | 'rappel échéance garanties financières à un mois'
  | 'rappel échéance garanties financières à deux mois'
  | 'instruction tacite de la demande de changement de représentant légal';

export type RechercherStatutTâchePlanifiée = 'planifiée' | 'annulée' | 'executée';

export class TâchePlanifiéeWorld {
  rechercherTypeTâchePlanifiée(value: RechercherTypeTâchePlanifiée) {
    return match(value)
      .with(
        'échoir les garanties financières',
        () => GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir,
      )
      .with(
        'rappel échéance garanties financières à un mois',
        () => GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois,
      )
      .with(
        'rappel échéance garanties financières à deux mois',
        () => GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois,
      )
      .with(
        'instruction tacite de la demande de changement de représentant légal',
        () =>
          ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal
            .changementAccordOuRejetTacite,
      )
      .exhaustive();
  }
  rechercherStatutTâchePlanifiée(value: RechercherStatutTâchePlanifiée) {
    return match(value)
      .with('planifiée', () => StatutTâchePlanifiée.enAttenteExécution)
      .with('annulée', () => StatutTâchePlanifiée.annulée)
      .with('executée', () => StatutTâchePlanifiée.exécutée)
      .exhaustive();
  }
}
