import { Abandon, GarantiesFinancières } from '@potentiel-domain/laureat';
import { Raccordement } from '@potentiel-domain/reseau';

export type RechercherTypeTâche =
  | 'transmettre la preuve de recandidature'
  | 'confirmer un abandon'
  | 'transmettre les garanties financières'
  | 'mettre à jour le gestionnaire de réseau';

export class TâcheWorld {
  rechercherTypeTâche(value: RechercherTypeTâche): string {
    switch (value) {
      case 'transmettre la preuve de recandidature':
        return Abandon.TypeTâcheAbandon.transmettrePreuveRecandidature.type;
      case 'confirmer un abandon':
        return Abandon.TypeTâcheAbandon.confirmer.type;
      case 'transmettre les garanties financières':
        return GarantiesFinancières.TypeTâcheGarantiesFinancières.demander.type;
      case 'mettre à jour le gestionnaire de réseau':
        return Raccordement.TypeTâcheRaccordement.gestionnaireRéseauInconnuAttribué.type;
      default:
        return 'inconnue';
    }
  }
}
