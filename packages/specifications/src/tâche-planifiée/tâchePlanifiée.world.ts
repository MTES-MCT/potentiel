import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export type TypeTâchePlanifiée =
  | 'échoir les garanties financières'
  | 'rappel échéance garanties financières à un mois'
  | 'rappel échéance garanties financières à deux mois'
  | 'rappel échéance garanties financières à trois mois'
  | 'rappel des garanties financières à transmettre'
  | 'gestion automatique de la demande de changement de représentant légal'
  | "rappel d'instruction de la demande de changement de représentant légal à deux mois"
  | 'supprimer automatiquement le document à trois mois'
  | 'relance transmission de la demande complète raccordement'
  | 'rappel échéance achèvement à trois mois'
  | 'rappel échéance achèvement à deux mois'
  | 'rappel échéance achèvement à un mois';

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
      .with(
        'relance transmission de la demande complète raccordement',
        () =>
          Lauréat.Raccordement.TypeTâchePlanifiéeRaccordement
            .relanceTransmissionDeLaDemandeComplèteRaccordement,
      )
      .with(
        'rappel échéance achèvement à trois mois',
        () => Lauréat.Achèvement.TypeTâchePlanifiéeAchèvement.rappelÉchéanceTroisMois,
      )
      .with(
        'rappel échéance achèvement à deux mois',
        () => Lauréat.Achèvement.TypeTâchePlanifiéeAchèvement.rappelÉchéanceDeuxMois,
      )
      .with(
        'rappel échéance achèvement à un mois',
        () => Lauréat.Achèvement.TypeTâchePlanifiéeAchèvement.rappelÉchéanceUnMois,
      )
      .exhaustive();
  }
}
