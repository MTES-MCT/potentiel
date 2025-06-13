import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

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

  mapChangementToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    if (!this.enregistrerChangementFournisseur.aÉtéCréé) {
      throw new Error(`Aucune information enregistrée n'a été créée dans FournisseurWorld`);
    }

    const expected: Lauréat.Fournisseur.ConsulterChangementFournisseurReadModel = {
      identifiantProjet,
      changement: {
        enregistréLe: DateTime.convertirEnValueType(
          this.enregistrerChangementFournisseur.enregistréLe,
        ),
        enregistréPar: Email.convertirEnValueType(
          this.enregistrerChangementFournisseur.enregistréPar,
        ),
        fournisseurs: this.enregistrerChangementFournisseur.fournisseurs?.map(
          ({ nomDuFabricant, typeFournisseur }) => ({
            nomDuFabricant,
            typeFournisseur:
              Lauréat.Fournisseur.TypeFournisseur.convertirEnValueType(typeFournisseur),
          }),
        ),
        évaluationCarboneSimplifiée: this.enregistrerChangementFournisseur.évaluationCarbone,
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.Fournisseur.TypeDocumentFournisseur.pièceJustificative.formatter(),
          DateTime.convertirEnValueType(
            this.enregistrerChangementFournisseur.enregistréLe,
          ).formatter(),
          this.enregistrerChangementFournisseur.pièceJustificative.format,
        ),
        raison: this.enregistrerChangementFournisseur.raison,
      },
    };

    return expected;
  }
}
