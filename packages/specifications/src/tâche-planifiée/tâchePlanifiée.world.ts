import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export type TypeTâchePlanifiée =
  | 'échoir les garanties financières'
  | 'rappel échéance garanties financières à un mois'
  | 'rappel échéance garanties financières à trois mois'
  | 'rappel des garanties financières à transmettre'
  | 'gestion automatique de la demande de changement de représentant légal'
  | "rappel d'instruction de la demande de changement de représentant légal à deux mois"
  | 'supprimer automatiquement le document à trois mois';

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
        'rappel échéance garanties financières à trois mois',
        () =>
          Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières
            .rappelÉchéanceTroisMois,
      )
      .with(
        'rappel des garanties financières à transmettre',
        () => Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelEnAttente,
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
}
