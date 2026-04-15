import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Lauréat } from '@potentiel-domain/projet';

import { LauréatWorld } from '../projet/lauréat/lauréat.world.js';

import { ModifierRéférenceDossierRaccordementFixture } from './dossierRaccordement/fixtures/modifierRéférenceDossierRaccordement.fixture.js';
import { DemandeComplèteRaccordementWorld } from './demandeComplèteDeRaccordement/demandeComplèteRaccordement.world.js';
import { PropositionTechniqueEtFinancièreWorld } from './propositionTechniqueEtFinancière/propositionTechniqueEtFinancière.world.js';
import { DateMiseEnServiceWorld } from './dateDeMiseEnService/dateMiseEnService.world.js';

export class RaccordementWorld {
  readonly modifierRéférenceDossierRaccordementFixture =
    new ModifierRéférenceDossierRaccordementFixture();

  readonly demandeComplèteDeRaccordement = new DemandeComplèteRaccordementWorld();
  readonly propositionTechniqueEtFinancière = new PropositionTechniqueEtFinancièreWorld();
  readonly dateMiseEnService: DateMiseEnServiceWorld;

  constructor(public lauréatWorld: LauréatWorld) {
    this.dateMiseEnService = new DateMiseEnServiceWorld(this);
  }

  get référenceDossier() {
    return this.modifierRéférenceDossierRaccordementFixture.aÉtéCréé
      ? this.modifierRéférenceDossierRaccordementFixture.nouvelleRéférenceDossier
      : this.demandeComplèteDeRaccordement.importerFixture.aÉtéCréé
        ? this.demandeComplèteDeRaccordement.importerFixture.référenceDossier
        : this.demandeComplèteDeRaccordement.transmettreFixture.référenceDossier;
  }

  #identifiantGestionnaireRéseau!: string;
  get identifiantGestionnaireRéseau() {
    return this.#identifiantGestionnaireRéseau;
  }
  set identifiantGestionnaireRéseau(identifiantGestionnaireRéseau: string) {
    this.#identifiantGestionnaireRéseau = identifiantGestionnaireRéseau;
  }

  mapToExpected() {
    const nouvelleRéférenceDossier = this.modifierRéférenceDossierRaccordementFixture.aÉtéCréé
      ? this.modifierRéférenceDossierRaccordementFixture.nouvelleRéférenceDossier
      : undefined;

    const identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        this.identifiantGestionnaireRéseau,
      );

    const dossier = {
      identifiantProjet: this.lauréatWorld.identifiantProjet,
      identifiantGestionnaireRéseau,
      demandeComplèteRaccordement:
        this.demandeComplèteDeRaccordement.mapToExpected(nouvelleRéférenceDossier),
      référence: Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
        this.référenceDossier,
      ),
      miseEnService: this.dateMiseEnService.modifierFixture.aÉtéCréé
        ? this.dateMiseEnService.modifierFixture.mapToExpected()
        : this.dateMiseEnService.transmettreFixture.mapToExpected(),
      propositionTechniqueEtFinancière:
        this.propositionTechniqueEtFinancière.mapToExpected(nouvelleRéférenceDossier),
    };

    const gestionnaireRéseau = identifiantGestionnaireRéseau.estInconnu()
      ? undefined
      : this.lauréatWorld.potentielWorld.gestionnaireRéseauWorld.getGestionnaire(
          identifiantGestionnaireRéseau.codeEIC,
        );

    return {
      raccordement: {
        dossiers: [dossier],
        identifiantProjet: this.lauréatWorld.identifiantProjet,
        identifiantGestionnaireRéseau,
        gestionnaireRéseau: gestionnaireRéseau
          ? {
              raisonSociale: gestionnaireRéseau.raisonSociale,
              contactEmail: gestionnaireRéseau.contactEmail,
            }
          : undefined,
        miseEnService: this.dateMiseEnService.modifierFixture.aÉtéCréé
          ? {
              date: this.dateMiseEnService.modifierFixture.mapToExpected()?.dateMiseEnService,
              référenceDossier:
                Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
                  nouvelleRéférenceDossier ?? this.référenceDossier,
                ),
            }
          : this.dateMiseEnService.transmettreFixture.aÉtéCréé
            ? {
                date: this.dateMiseEnService.transmettreFixture.mapToExpected()?.dateMiseEnService,
                référenceDossier:
                  Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
                    nouvelleRéférenceDossier ?? this.référenceDossier,
                  ),
              }
            : undefined,
      },
      dossier,
    };
  }
}
