import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export type RechercherTypeTâche =
  | 'transmettre la preuve de recandidature'
  | 'confirmer un abandon'
  | 'transmettre les garanties financières'
  | 'mettre à jour le gestionnaire de réseau'
  | 'transmettre une référence de raccordement'
  | "renseigner l'accusé de réception de la demande complète de raccordement";

export class TâcheWorld {
  rechercherTypeTâche(value: RechercherTypeTâche): Lauréat.Tâche.TypeTâche.ValueType {
    return match(value)
      .with(
        'transmettre la preuve de recandidature',
        () => Lauréat.Tâche.TypeTâche.abandonTransmettrePreuveRecandidature,
      )
      .with('confirmer un abandon', () => Lauréat.Tâche.TypeTâche.abandonConfirmer)
      .with(
        'transmettre les garanties financières',
        () => Lauréat.Tâche.TypeTâche.garantiesFinancièresDemander,
      )
      .with(
        'mettre à jour le gestionnaire de réseau',
        () => Lauréat.Tâche.TypeTâche.raccordementGestionnaireRéseauInconnuAttribué,
      )
      .with(
        'transmettre une référence de raccordement',
        () => Lauréat.Tâche.TypeTâche.raccordementRéférenceNonTransmise,
      )
      .with(
        "renseigner l'accusé de réception de la demande complète de raccordement",
        () =>
          Lauréat.Tâche.TypeTâche.raccordementRenseignerAccuséRéceptionDemandeComplèteRaccordement,
      )
      .exhaustive();
  }
}
