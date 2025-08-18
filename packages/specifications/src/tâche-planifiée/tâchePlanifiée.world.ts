import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export type TypeTâchePlanifiée =
  | 'échoir les garanties financières'
  | 'rappel échéance garanties financières à un mois'
  | 'rappel échéance garanties financières à deux mois'
  | 'gestion automatique de la demande de changement de représentant légal'
  | "rappel d'instruction de la demande de changement de représentant légal à deux mois"
  | 'supprimer automatiquement le document à trois mois';

export type RechercherStatutTâchePlanifiée = 'planifiée' | 'annulée' | 'exécutée';

export class TâchePlanifiéeWorld {
  rechercherTypeTâchePlanifiée(value: TypeTâchePlanifiée) {
    return match(value)
      .with(
        'échoir les garanties financières',
        () => Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir,
      )
      .with(
        'rappel échéance garanties financières à un mois',
        () =>
          Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois,
      )
      .with(
        'rappel échéance garanties financières à deux mois',
        () =>
          Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières
            .rappelÉchéanceDeuxMois,
      )
      .with(
        'gestion automatique de la demande de changement de représentant légal',
        () =>
          Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal
            .gestionAutomatiqueDemandeChangement,
      )
      .with(
        "rappel d'instruction de la demande de changement de représentant légal à deux mois",
        () =>
          Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal
            .rappelInstructionÀDeuxMois,
      )
      .with(
        'supprimer automatiquement le document à trois mois',
        () =>
          Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal
            .suppressionDocumentÀTroisMois,
      )
      .exhaustive();
  }

  rechercherStatutTâchePlanifiée(value: RechercherStatutTâchePlanifiée) {
    return match(value)
      .with('planifiée', () => Lauréat.TâchePlanifiée.StatutTâchePlanifiée.enAttenteExécution)
      .with('annulée', () => Lauréat.TâchePlanifiée.StatutTâchePlanifiée.annulée)
      .with('exécutée', () => Lauréat.TâchePlanifiée.StatutTâchePlanifiée.exécutée)
      .exhaustive();
  }
}
