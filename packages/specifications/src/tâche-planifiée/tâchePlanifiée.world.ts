import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { StatutTâchePlanifiée } from '@potentiel-domain/tache-planifiee';

export type RechercherTypeTâchePlanifiée =
  | 'échoir les garanties financières'
  | 'rappel échéance garanties financières à un mois'
  | 'rappel échéance garanties financières à deux mois';

export type RechercherStatutTâchePlanifiée = 'planifiée' | 'annulée' | 'executée';

export class TâchePlanifiéeWorld {
  rechercherTypeTâchePlanifiée(
    value: RechercherTypeTâchePlanifiée,
  ): GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.ValueType {
    switch (value) {
      case 'échoir les garanties financières':
        return GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir;
      case 'rappel échéance garanties financières à un mois':
        return GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois;
      case 'rappel échéance garanties financières à deux mois':
        return GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois;
      default:
        return GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.inconnue;
    }
  }
  rechercherStatutTâchePlanifiée(value: RechercherStatutTâchePlanifiée) {
    switch (value) {
      case 'planifiée':
        return StatutTâchePlanifiée.enAttenteExécution;
      case 'annulée':
        return StatutTâchePlanifiée.annulée;
      case 'executée':
        return StatutTâchePlanifiée.exécutée;
      default:
        return StatutTâchePlanifiée.inconnu;
    }
  }
}
