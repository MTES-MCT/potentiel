import { match } from 'ts-pattern';

import { Tâche } from '@potentiel-domain/tache';

export type RechercherTypeTâche =
  | 'transmettre la preuve de recandidature'
  | 'confirmer un abandon'
  | 'transmettre les garanties financières'
  | 'mettre à jour le gestionnaire de réseau'
  | 'transmettre une référence de raccordement'
  | "renseigner l'accusé de récéption de la demande complète de raccordement";

export class TâcheWorld {
  rechercherTypeTâche(value: RechercherTypeTâche): Tâche.TypeTâche.ValueType {
    return match(value)
      .with(
        'transmettre la preuve de recandidature',
        () => Tâche.TypeTâche.abandonTransmettrePreuveRecandidature,
      )
      .with('confirmer un abandon', () => Tâche.TypeTâche.abandonConfirmer)
      .with(
        'transmettre les garanties financières',
        () => Tâche.TypeTâche.garantiesFinancièresDemander,
      )
      .with(
        'mettre à jour le gestionnaire de réseau',
        () => Tâche.TypeTâche.raccordementGestionnaireRéseauInconnuAttribué,
      )
      .with(
        'transmettre une référence de raccordement',
        () => Tâche.TypeTâche.raccordementRéférenceNonTransmise,
      )
      .with(
        "renseigner l'accusé de récéption de la demande complète de raccordement",
        () => Tâche.TypeTâche.raccordementRenseignerAccuséRéceptionDemandeComplèteRaccordement,
      )
      .exhaustive();
  }
}
