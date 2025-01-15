import { match } from 'ts-pattern';

import { GarantiesFinancières, ReprésentantLégal } from '@potentiel-domain/laureat';
import { StatutTâchePlanifiée } from '@potentiel-domain/tache-planifiee';

import { AjouterTâchesPlanifiéesFixture } from './fixtures/ajouterTâchesPlanifiées.fixture';

export type TypeTâchePlanifiée =
  | 'échoir les garanties financières'
  | 'rappel échéance garanties financières à un mois'
  | 'rappel échéance garanties financières à deux mois'
  | 'gestion automatique de la demande de changement de représentant légal'
  | "rappel d'instruction de la demande de changement de représentant légal à deux mois";

export type RechercherStatutTâchePlanifiée = 'planifiée' | 'annulée' | 'exécutée';

export class TâchePlanifiéeWorld {
  #ajouterTâchesPlanifiéesFixture: AjouterTâchesPlanifiéesFixture;

  get ajouterTâchesPlanifiéesFixture() {
    return this.#ajouterTâchesPlanifiéesFixture;
  }

  constructor() {
    this.#ajouterTâchesPlanifiéesFixture = new AjouterTâchesPlanifiéesFixture();
  }

  rechercherTâchePlanifiée(value: TypeTâchePlanifiée) {
    const tâche = this.#ajouterTâchesPlanifiéesFixture.tâches.find(
      (t) => t.typeTâchePlanifiée === value,
    );

    if (!tâche) {
      throw new Error('Tâche planifiée non trouvée');
    }

    return tâche;
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
      .with(
        "rappel d'instruction de la demande de changement de représentant légal à deux mois",
        () =>
          ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal
            .rappelInstructionÀDeuxMois,
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
