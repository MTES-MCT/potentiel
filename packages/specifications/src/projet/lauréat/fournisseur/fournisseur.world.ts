import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { ModifierÉvaluationCarboneFixture } from './fixtures/modifierÉvaluationCarbone.fixture';

export class FournisseurWorld {
  constructor() {}
  readonly modifierÉvaluationCarbone = new ModifierÉvaluationCarboneFixture();
  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    candidature: Candidature.ConsulterCandidatureReadModel,
  ) {
    return {
      identifiantProjet,
      fournisseurs: candidature.fournisseurs,
      évaluationCarboneSimplifiée: this.modifierÉvaluationCarbone.aÉtéCréé
        ? this.modifierÉvaluationCarbone.évaluationCarbone
        : candidature.evaluationCarboneSimplifiée,
    };
  }
}
