import { match } from 'ts-pattern';

import { GarantiesFinancières, ReprésentantLégal } from '@potentiel-domain/laureat';
import { StatutTâchePlanifiée } from '@potentiel-domain/tache-planifiee';

import { AjouterTâchePlanifiéeFixture } from './fixtures/ajouterTâchePlanifiée.fixture';

export type TypeTâchePlanifiée =
  | 'échoir les garanties financières'
  | 'rappel échéance garanties financières à un mois'
  | 'rappel échéance garanties financières à deux mois'
  | 'gestion automatique de la demande de changement de représentant légal';

export type RechercherStatutTâchePlanifiée = 'planifiée' | 'annulée' | 'exécutée';

export class TâchePlanifiéeWorld {
  #ajouterTâchePlanifiéeFixture: AjouterTâchePlanifiéeFixture;

  get ajouterTâchePlanifiéeFixture() {
    return this.#ajouterTâchePlanifiéeFixture;
  }

  constructor() {
    this.#ajouterTâchePlanifiéeFixture = new AjouterTâchePlanifiéeFixture();
  }

  rechercherTypeTâchePlanifiée(value: TypeTâchePlanifiée) {
    return match(value)
      .with(
        'échoir les garanties financières',
        () => GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir,
      )
      .with(
        'rappel échéance garanties financières à un mois',
        () => GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois,
      )
      .with(
        'rappel échéance garanties financières à deux mois',
        () => GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois,
      )
      .with(
        'gestion automatique de la demande de changement de représentant légal',
        () =>
          ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal
            .gestionAutomatiqueDemandeChangement,
      )
      .exhaustive();
  }
  rechercherStatutTâchePlanifiée(value: RechercherStatutTâchePlanifiée) {
    return match(value)
      .with('planifiée', () => StatutTâchePlanifiée.enAttenteExécution)
      .with('annulée', () => StatutTâchePlanifiée.annulée)
      .with('exécutée', () => StatutTâchePlanifiée.exécutée)
      .exhaustive();
  }
}
