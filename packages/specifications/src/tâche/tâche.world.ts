import { TypeTâche } from '@potentiel-domain/tache';

export type RechercherTypeTâche =
  | 'transmettre la preuve de recandidature'
  | 'confirmer un abandon'
  | 'transmettre les garanties financières';

export class TâcheWorld {
  rechercherTypeTâche(value: RechercherTypeTâche): TypeTâche.ValueType {
    switch (value) {
      case 'transmettre la preuve de recandidature':
        return TypeTâche.abandonTransmettrePreuveRecandidature;
      case 'confirmer un abandon':
        return TypeTâche.abandonConfirmer;
      case 'transmettre les garanties financières':
        return TypeTâche.garantiesFinancieresDemander;
      default:
        return TypeTâche.inconnue;
    }
  }
}
