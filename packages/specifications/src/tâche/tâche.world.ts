import { TypeTâche } from '@potentiel-domain/tache';
import { TypeTâchePlanifiée } from '@potentiel-domain/tache-planifiee';

export type RechercherTypeTâche =
  | 'transmettre la preuve de recandidature'
  | 'confirmer un abandon'
  | 'transmettre les garanties financières'
  | 'mettre à jour le gestionnaire de réseau';

export type RechercherTypeTâchePlanifiée = 'échoir les garanties financières';

export class TâcheWorld {
  rechercherTypeTâche(value: RechercherTypeTâche): TypeTâche.ValueType {
    switch (value) {
      case 'transmettre la preuve de recandidature':
        return TypeTâche.abandonTransmettrePreuveRecandidature;
      case 'confirmer un abandon':
        return TypeTâche.abandonConfirmer;
      case 'transmettre les garanties financières':
        return TypeTâche.garantiesFinancieresDemander;
      case 'mettre à jour le gestionnaire de réseau':
        return TypeTâche.raccordementGestionnaireRéseauInconnuAttribué;
      default:
        return TypeTâche.inconnue;
    }
  }

  rechercherTypeTâchePlanifiée(value: RechercherTypeTâchePlanifiée): TypeTâchePlanifiée.ValueType {
    switch (value) {
      case 'échoir les garanties financières':
        return TypeTâchePlanifiée.garantiesFinancieresÉchoir;
      default:
        return TypeTâchePlanifiée.inconnue;
    }
  }
}
