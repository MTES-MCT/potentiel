import { TypeTâchePlanifiée } from '@potentiel-domain/tache-planifiee';

export type RechercherTypeTâchePlanifiée = 'échoir les garanties financières';

export class TâchePlanifiéeWorld {
  rechercherTypeTâchePlanifiée(value: RechercherTypeTâchePlanifiée): TypeTâchePlanifiée.ValueType {
    switch (value) {
      case 'échoir les garanties financières':
        return TypeTâchePlanifiée.garantiesFinancieresÉchoir;
      default:
        return TypeTâchePlanifiée.inconnue;
    }
  }
}
