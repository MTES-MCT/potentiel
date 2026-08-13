import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export type RechercherTypeTâche =
  | 'transmettre la preuve de recandidature'
  | 'confirmer un abandon'
  | 'transmettre les garanties financières'
  | 'mettre à jour le gestionnaire de réseau'
  | 'transmettre une référence de raccordement'
  | 'transmettre un document de raccordement (ptf,cr ou crd)'
  | 'transmettre une convention de raccordement'
  | 'transmettre une proposition technique et financière'
  | "renseigner l'accusé de réception de la demande complète de raccordement"
  | "renseigner le numéro d'identification";

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
        'transmettre un document de raccordement (ptf,cr ou crd)',
        () => Lauréat.Tâche.TypeTâche.raccordementTransmettreUnDocument,
      )
      .with(
        'transmettre une convention de raccordement',
        () => Lauréat.Tâche.TypeTâche.raccordementTransmettreConventionDeRaccordement,
      )
      .with(
        'transmettre une proposition technique et financière',
        () => Lauréat.Tâche.TypeTâche.raccordementTransmettrePropositionTechniqueEtFinancière,
      )
      .with(
        "renseigner l'accusé de réception de la demande complète de raccordement",
        () =>
          Lauréat.Tâche.TypeTâche.raccordementRenseignerAccuséRéceptionDemandeComplèteRaccordement,
      )
      .with(
        "renseigner le numéro d'identification",
        () => Lauréat.Tâche.TypeTâche.producteurRenseignerNuméroIdentification,
      )
      .exhaustive();
  }
}
