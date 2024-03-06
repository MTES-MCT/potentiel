import { TypeTâche } from '@potentiel-domain/tache';

export class TâcheWorld {
  rechercherTypeTâche(value: string) {
    if (value === 'transmettre la preuve de recandidature') {
      return TypeTâche.abandonTransmettrePreuveRecandidature;
    } else if (value === 'confirmer un abandon') {
      return TypeTâche.abandonConfirmer;
    }

    return TypeTâche.inconnue;
  }
}
