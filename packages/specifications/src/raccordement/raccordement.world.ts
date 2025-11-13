import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { LauréatWorld } from '../projet/lauréat/lauréat.world';

import { TransmettreDateMiseEnServiceFixture } from './dateDeMiseEnService/fixtures/transmettreDateDeMiseEnService.fixture';
import { ModifierRéférenceDossierRaccordementFixture } from './dossierRaccordement/fixtures/modifierRéférenceDossierRaccordement.fixture';
import { DemandeComplèteRaccordementWorld } from './demandeComplèteDeRaccordement/demandeComplèteRaccordement.world';
import { PropositionTechniqueEtFinancièreWorld } from './propositionTechniqueEtFinancière/propositionTechniqueEtFinancière.world';

export class RaccordementWorld {
  readonly modifierRéférenceDossierRaccordementFixture =
    new ModifierRéférenceDossierRaccordementFixture();

  readonly demandeComplèteDeRaccordement = new DemandeComplèteRaccordementWorld();
  readonly propositionTechniqueEtFinancière = new PropositionTechniqueEtFinancièreWorld();
  readonly transmettreDateMiseEnServiceFixture: TransmettreDateMiseEnServiceFixture;

  constructor(public lauréatWorld: LauréatWorld) {
    this.transmettreDateMiseEnServiceFixture = new TransmettreDateMiseEnServiceFixture(this);
  }

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
    const identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        this.identifiantGestionnaireRéseau,
      );
    const dossier = {
      identifiantProjet,
      identifiantGestionnaireRéseau,
      demandeComplèteRaccordement:
        this.demandeComplèteDeRaccordement.mapToExpected(nouvelleRéférenceDossier),
      référence: Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
        this.référenceDossier,
      ),
      miseEnService: this.transmettreDateMiseEnServiceFixture.mapToExpected(),
      propositionTechniqueEtFinancière:
        this.propositionTechniqueEtFinancière.mapToExpected(nouvelleRéférenceDossier),
    };

    return {
      raccordement: {
        dossiers: [dossier],
        identifiantProjet,
        identifiantGestionnaireRéseau,
      },
      dossier,
    };
  }
}
