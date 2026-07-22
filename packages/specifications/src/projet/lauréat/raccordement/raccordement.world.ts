import { Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import type { LauréatWorld } from '../lauréat.world.js';
import { DateMiseEnServiceWorld } from './dateDeMiseEnService/dateMiseEnService.world.js';
import { DemandeComplèteRaccordementWorld } from './demandeComplèteDeRaccordement/demandeComplèteRaccordement.world.js';
import { DocumentRaccordementWorld } from './documentsRaccordement/documentRaccordement.world.js';
import { ModifierRéférenceDossierRaccordementFixture } from './dossierRaccordement/fixtures/modifierRéférenceDossierRaccordement.fixture.js';

export class RaccordementWorld {
  readonly modifierRéférenceDossierRaccordementFixture =
    new ModifierRéférenceDossierRaccordementFixture();

  readonly demandeComplèteDeRaccordement = new DemandeComplèteRaccordementWorld();
  readonly documentRaccordement = new DocumentRaccordementWorld();
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
      demandeComplèteRaccordement: this.demandeComplèteDeRaccordement.mapToExpected(
        nouvelleRéférenceDossier,
      ),
      référence: Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
        this.référenceDossier,
      ),
      dateMiseEnService: this.dateMiseEnService.modifierFixture.aÉtéCréé
        ? this.dateMiseEnService.modifierFixture.mapToExpected()
        : this.dateMiseEnService.transmettreFixture.mapToExpected(),
      propositionTechniqueEtFinancière: this.documentRaccordement.mapToExpected(
        Lauréat.Raccordement.TypeDocumentsRaccordement.propositionTechniqueEtFinancière.type,
        this.lauréatWorld.identifiantProjet.formatter(),
        nouvelleRéférenceDossier,
      ),
      conventionDeRaccordement: this.documentRaccordement.mapToExpected(
        Lauréat.Raccordement.TypeDocumentsRaccordement.conventionDeRaccordement.type,
        this.lauréatWorld.identifiantProjet.formatter(),
        nouvelleRéférenceDossier,
      ),
      conventionDirectDeRaccordement: this.documentRaccordement.mapToExpected(
        Lauréat.Raccordement.TypeDocumentsRaccordement.conventionDeRaccordementDirecte.type,
        this.lauréatWorld.identifiantProjet.formatter(),
        nouvelleRéférenceDossier,
      ),
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
              contactEmail: gestionnaireRéseau.contactEmail
                ? Email.convertirEnValueType(gestionnaireRéseau.contactEmail)
                : undefined,
            }
          : undefined,
        miseEnService: this.dateMiseEnService.modifierFixture.aÉtéCréé
          ? {
              date: this.dateMiseEnService.modifierFixture.mapToExpected(),
              référenceDossier:
                Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
                  nouvelleRéférenceDossier ?? this.référenceDossier,
                ),
            }
          : this.dateMiseEnService.transmettreFixture.aÉtéCréé
            ? {
                date: this.dateMiseEnService.transmettreFixture.mapToExpected(),
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
