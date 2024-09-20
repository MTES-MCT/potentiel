import { TypeTâche } from '@potentiel-domain/tache';

export type RechercherTypeTâche =
  | 'transmettre la preuve de recandidature'
  | 'confirmer un abandon'
  | 'transmettre les garanties financières'
  | 'mettre à jour le gestionnaire de réseau'
  | 'échoir les garanties financières'
  | 'transmettre une référence de raccordement';

export class TâcheWorld {
  rechercherTypeTâche(value: RechercherTypeTâche): TypeTâche.ValueType {
    switch (value) {
      case 'transmettre la preuve de recandidature':
        return TypeTâche.abandonTransmettrePreuveRecandidature;
      case 'confirmer un abandon':
        return TypeTâche.abandonConfirmer;
      case 'échoir les garanties financières':
        return TypeTâche.garantiesFinancieresEchoir;
      case 'transmettre les garanties financières':
        return TypeTâche.garantiesFinancièresDemander;
      case 'mettre à jour le gestionnaire de réseau':
        return TypeTâche.raccordementGestionnaireRéseauInconnuAttribué;
      case 'transmettre une référence de raccordement':
        return TypeTâche.raccordementRéférenceNonTransmise;
      default:
        return TypeTâche.inconnue;
    }
  }
}
