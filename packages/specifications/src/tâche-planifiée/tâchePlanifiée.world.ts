import { TypeTâchePlanifiée, StatutTâchePlanifiée } from '@potentiel-domain/tache-planifiee';

export type RechercherTypeTâchePlanifiée = 'échoir les garanties financières';
export type RechercherStatutTâchePlanifiée = 'planifiée' | 'annulée' | 'executée';

export class TâchePlanifiéeWorld {
  rechercherTypeTâchePlanifiée(value: RechercherTypeTâchePlanifiée): TypeTâchePlanifiée.ValueType {
    switch (value) {
      case 'échoir les garanties financières':
        return TypeTâchePlanifiée.garantiesFinancieresÉchoir;
      default:
        return TypeTâchePlanifiée.inconnue;
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
