import { IdentifiantProjet } from '@potentiel-domain/common';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';

import { TransmettreDateMiseEnServiceFixture } from './fixtures/transmettreDateDeMiseEnService.fixture';
import { ModifierRéférenceDossierRaccordementFixture } from './fixtures/modifierRéférenceDossierRaccordement.fixture';
import { DemandeComplèteRaccordementWorld } from './demandeComplèteRaccordement.world';
import { PropositionTechniqueEtFinancièreWorld } from './propositionTechniqueEtFinancière.world';

export class RaccordementWorld {
  readonly modifierRéférenceDossierRaccordementFixture =
    new ModifierRéférenceDossierRaccordementFixture();

  readonly demandeComplèteDeRaccordement = new DemandeComplèteRaccordementWorld();
  readonly propositionTechniqueEtFinancière = new PropositionTechniqueEtFinancièreWorld();
  readonly transmettreDateMiseEnServiceFixture = new TransmettreDateMiseEnServiceFixture();

  get référenceDossier() {
    return this.modifierRéférenceDossierRaccordementFixture.aÉtéCréé
      ? this.modifierRéférenceDossierRaccordementFixture.nouvelleRéférenceDossier
      : this.demandeComplèteDeRaccordement.transmettreFixture.référenceDossier;
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

    const dossier = {
      demandeComplèteRaccordement:
        this.demandeComplèteDeRaccordement.mapToExpected(nouvelleRéférenceDossier),
      référence: Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
        this.référenceDossier,
      ),
      miseEnService: this.transmettreDateMiseEnServiceFixture.mapToExpected(),
      propositionTechniqueEtFinancière:
        this.propositionTechniqueEtFinancière.mapToExpected(nouvelleRéférenceDossier),
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
