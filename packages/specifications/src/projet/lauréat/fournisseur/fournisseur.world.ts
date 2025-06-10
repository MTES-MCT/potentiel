import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { ModifierÉvaluationCarboneFixture } from './fixtures/modifierÉvaluationCarbone.fixture';
import { EnregistrerChangementFournisseurFixture } from './fixtures/enregistrerChangementFournisseur.fixture';

export class FournisseurWorld {
  constructor() {}
  readonly modifierÉvaluationCarbone = new ModifierÉvaluationCarboneFixture();
  readonly enregistrerChangementFournisseur = new EnregistrerChangementFournisseurFixture();

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    return {
      évaluationCarbone: exemple['évaluation carbone']
        ? Number(exemple['évaluation carbone'])
        : undefined,
    };
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    candidature: Candidature.ConsulterCandidatureReadModel,
  ) {
    return {
      identifiantProjet,
      fournisseurs: this.enregistrerChangementFournisseur.aÉtéCréé
        ? this.enregistrerChangementFournisseur.fournisseurs.map(
            ({ nomDuFabricant, typeFournisseur }) => ({
              nomDuFabricant,
              typeFournisseur:
                Lauréat.Fournisseur.TypeFournisseur.convertirEnValueType(typeFournisseur),
            }),
          )
        : candidature.fournisseurs,
      évaluationCarboneSimplifiée: this.modifierÉvaluationCarbone.aÉtéCréé
        ? this.modifierÉvaluationCarbone.évaluationCarbone
        : this.enregistrerChangementFournisseur.aÉtéCréé
          ? this.enregistrerChangementFournisseur.évaluationCarbone
          : candidature.evaluationCarboneSimplifiée,
    };
  }
}
