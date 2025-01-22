import { IdentifiantProjet } from '@potentiel-domain/common';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';

import { TransmettreDemandeComplèteRaccordementFixture } from './fixtures/transmettreDemandeComplèteDeRaccordement.fixture';
import { TransmettrePropositionTechniqueEtFinancièreFixture } from './fixtures/transmettrePropositionTechniqueEtFinancière.fixture';
import { ModifierDemandeComplèteRaccordementFixture } from './fixtures/modifierDemandeComplèteDeRaccordement.fixture';
import { TransmettreDateMiseEnServiceFixture } from './fixtures/transmettreDateDeMiseEnService.fixture';
import { ModifierPropositionTechniqueEtFinancièreFixture } from './fixtures/modifierPropositionTechniqueEtFinancière.fixture';
import { ModifierRéférenceDossierRaccordementFixture } from './fixtures/modifierRéférenceDossierRaccordement.fixture';

export class RaccordementWorld {
  readonly transmettreDemandeComplèteRaccordementFixture =
    new TransmettreDemandeComplèteRaccordementFixture();
  readonly modifierDemandeComplèteRaccordementFixture =
    new ModifierDemandeComplèteRaccordementFixture();

  readonly modifierRéférenceDossierRaccordementFixture =
    new ModifierRéférenceDossierRaccordementFixture();

  readonly transmettrePropositionTechniqueEtFinancièreFixture =
    new TransmettrePropositionTechniqueEtFinancièreFixture();
  readonly modifierPropositionTechniqueEtFinancièreFixture =
    new ModifierPropositionTechniqueEtFinancièreFixture();

  readonly transmettreDateMiseEnServiceFixture = new TransmettreDateMiseEnServiceFixture();

  get référenceDossier() {
    return this.modifierRéférenceDossierRaccordementFixture.aÉtéCréé
      ? this.modifierRéférenceDossierRaccordementFixture.nouvelleRéférenceDossier
      : this.transmettreDemandeComplèteRaccordementFixture.référenceDossier;
  }

  #identifiantGestionnaireRéseau!: string;
  get identifiantGestionnaireRéseau() {
    return this.#identifiantGestionnaireRéseau;
  }
  set identifiantGestionnaireRéseau(identifiantGestionnaireRéseau: string) {
    this.#identifiantGestionnaireRéseau = identifiantGestionnaireRéseau;
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    const nouvelleRéférenceDossier = this.modifierRéférenceDossierRaccordementFixture.aÉtéCréé
      ? this.modifierRéférenceDossierRaccordementFixture.nouvelleRéférenceDossier
      : undefined;
    const propositionTechniqueEtFinancière =
      this.modifierPropositionTechniqueEtFinancièreFixture.mapToExpected(
        nouvelleRéférenceDossier,
      ) ??
      this.transmettrePropositionTechniqueEtFinancièreFixture.mapToExpected(
        nouvelleRéférenceDossier,
      );
    const dossier = {
      demandeComplèteRaccordement: {
        ...(this.modifierDemandeComplèteRaccordementFixture.mapToExpected(
          nouvelleRéférenceDossier,
        ) ??
          this.transmettreDemandeComplèteRaccordementFixture?.mapToExpected(
            nouvelleRéférenceDossier,
          )),
      },
      référence: Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
        this.référenceDossier,
      ),
      miseEnService: this.transmettreDateMiseEnServiceFixture.mapToExpected(),
      propositionTechniqueEtFinancière,
    };
    const identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        this.identifiantGestionnaireRéseau,
      );
    return {
      raccordement: {
        dossiers: [dossier],
        identifiantProjet,
        identifiantGestionnaireRéseau,
      },
      dossier: {
        ...dossier,
        identifiantProjet,
        identifiantGestionnaireRéseau,
      },
    };
  }
}
