import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ModifierÉvaluationCarboneFixture } from './fixtures/modifierÉvaluationCarbone.fixture';
import { MettreAJourFournisseurFixture } from './fixtures/mettreAJourFournisseur.fixture';

export class FournisseurWorld {
  constructor() {}
  readonly modifierÉvaluationCarbone = new ModifierÉvaluationCarboneFixture();
  readonly mettreAJourFournisseur = new MettreAJourFournisseurFixture();

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
    const appelOffres = appelsOffreData.find(
      (ao) => ao.id === candidature.identifiantProjet.appelOffre,
    )!;
    const expected: Lauréat.Fournisseur.ConsulterFournisseurReadModel = {
      identifiantProjet,
      fournisseurs: this.mettreAJourFournisseur.aÉtéCréé
        ? this.mettreAJourFournisseur.fournisseurs.map(
            Lauréat.Fournisseur.Fournisseur.convertirEnValueType,
          )
        : candidature.dépôt.fournisseurs,
      évaluationCarboneSimplifiée: this.modifierÉvaluationCarbone.aÉtéCréé
        ? this.modifierÉvaluationCarbone.évaluationCarbone
        : this.mettreAJourFournisseur.aÉtéCréé
          ? this.mettreAJourFournisseur.évaluationCarbone
          : candidature.dépôt.evaluationCarboneSimplifiée,
      technologie:
        appelOffres.technologie ??
        (candidature.dépôt.technologie.formatter() as AppelOffre.Technologie),
      évaluationCarboneSimplifiéeInitiale: candidature.dépôt.evaluationCarboneSimplifiée,
    };

    return expected;
  }

  mapChangementToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    if (!this.mettreAJourFournisseur.aÉtéCréé) {
      throw new Error(`Aucune information enregistrée n'a été créée dans FournisseurWorld`);
    }

    const expected: Lauréat.Fournisseur.ConsulterChangementFournisseurReadModel = {
      identifiantProjet,
      changement: {
        enregistréLe: DateTime.convertirEnValueType(this.mettreAJourFournisseur.misAJourLe),
        enregistréPar: Email.convertirEnValueType(this.mettreAJourFournisseur.misAJourPar),
        fournisseurs: this.mettreAJourFournisseur.fournisseurs?.map(
          Lauréat.Fournisseur.Fournisseur.convertirEnValueType,
        ),
        évaluationCarboneSimplifiée: this.mettreAJourFournisseur.évaluationCarbone,
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.Fournisseur.TypeDocumentFournisseur.pièceJustificative.formatter(),
          DateTime.convertirEnValueType(this.mettreAJourFournisseur.misAJourLe).formatter(),
          this.mettreAJourFournisseur.pièceJustificative.format,
        ),
        raison: this.mettreAJourFournisseur.raison,
      },
    };

    return expected;
  }
}
