import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/projet';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ModifierÉvaluationCarboneFixture } from './fixtures/modifierÉvaluationCarbone.fixture';
import { MettreÀJourFournisseurFixture } from './fixtures/mettreÀJourFournisseur.fixture';

export class FournisseurWorld {
  constructor() {}
  readonly modifierÉvaluationCarbone = new ModifierÉvaluationCarboneFixture();
  readonly mettreÀJourFournisseur = new MettreÀJourFournisseurFixture();

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
      fournisseurs: this.mettreÀJourFournisseur.aÉtéCréé
        ? this.mettreÀJourFournisseur.fournisseurs.map(
            Lauréat.Fournisseur.Fournisseur.convertirEnValueType,
          )
        : candidature.dépôt.fournisseurs,
      évaluationCarboneSimplifiée: this.modifierÉvaluationCarbone.aÉtéCréé
        ? this.modifierÉvaluationCarbone.évaluationCarbone
        : this.mettreÀJourFournisseur.aÉtéCréé
          ? this.mettreÀJourFournisseur.évaluationCarbone
          : candidature.dépôt.evaluationCarboneSimplifiée,
      technologie:
        appelOffres.technologie ??
        (candidature.dépôt.technologie.formatter() as AppelOffre.Technologie),
      évaluationCarboneSimplifiéeInitiale: candidature.dépôt.evaluationCarboneSimplifiée,
    };

    return expected;
  }

  mapChangementToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    if (!this.mettreÀJourFournisseur.aÉtéCréé) {
      throw new Error(`Aucune information enregistrée n'a été créée dans FournisseurWorld`);
    }

    const expected: Lauréat.Fournisseur.ConsulterChangementFournisseurReadModel = {
      identifiantProjet,
      changement: {
        enregistréLe: DateTime.convertirEnValueType(this.mettreÀJourFournisseur.misAJourLe),
        enregistréPar: Email.convertirEnValueType(this.mettreÀJourFournisseur.misAJourPar),
        fournisseurs: this.mettreÀJourFournisseur.fournisseurs?.map(
          Lauréat.Fournisseur.Fournisseur.convertirEnValueType,
        ),
        évaluationCarboneSimplifiée: this.mettreÀJourFournisseur.évaluationCarbone,
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.Fournisseur.TypeDocumentFournisseur.pièceJustificative.formatter(),
          DateTime.convertirEnValueType(this.mettreÀJourFournisseur.misAJourLe).formatter(),
          this.mettreÀJourFournisseur.pièceJustificative.format,
        ),
        raison: this.mettreÀJourFournisseur.raison,
      },
    };

    return expected;
  }
}
