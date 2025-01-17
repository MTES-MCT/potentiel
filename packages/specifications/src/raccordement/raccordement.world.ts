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
  readonly modifierRéférenceDossierRaccordement = new ModifierRéférenceDossierRaccordementFixture();
  readonly transmettrePropositionTechniqueEtFinancièreFixture =
    new TransmettrePropositionTechniqueEtFinancièreFixture();
  readonly modifierPropositionTechniqueEtFinancièreFixture =
    new ModifierPropositionTechniqueEtFinancièreFixture();

  readonly transmettreDateMiseEnServiceFixture = new TransmettreDateMiseEnServiceFixture();

  get identifiantProjet() {
    return this.transmettreDemandeComplèteRaccordementFixture.identifiantProjet;
  }

  get référenceDossier() {
    return this.modifierRéférenceDossierRaccordement.aÉtéCréé
      ? this.modifierRéférenceDossierRaccordement.nouvelleRéférenceDossier
      : this.transmettreDemandeComplèteRaccordementFixture.référenceDossier;
  }

  #identifiantGestionnaireRéseau!: string;
  get identifiantGestionnaireRéseau() {
    return this.#identifiantGestionnaireRéseau;
  }
  set identifiantGestionnaireRéseau(identifiantGestionnaireRéseau: string) {
    this.#identifiantGestionnaireRéseau = identifiantGestionnaireRéseau;
  }

  mapToExpected() {
    const nouvelleRéférenceDossier = this.modifierRéférenceDossierRaccordement.aÉtéCréé
      ? this.modifierRéférenceDossierRaccordement.nouvelleRéférenceDossier
      : undefined;
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
    };
    const identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        this.identifiantGestionnaireRéseau,
      );
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(this.identifiantProjet);
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
    /**
     * const {
        référence: actualRéférence,
        demandeComplèteRaccordement: {
          accuséRéception: actualAccuséRéception,
          dateQualification: actualDateQualification,
        },
        identifiantGestionnaireRéseau,
      } = dossierRaccordement;

      expect(identifiantGestionnaireRéseau.codeEIC).to.eq(
        raccordement.identifiantGestionnaireRéseau?.codeEIC,
        'Gestionnaire réseau incorrect',
      );

      expect(actualDateQualification?.estÉgaleÀ(expectedDateQualification)).to.be.true;
      expect(actualRéférence.estÉgaleÀ(expectedRéférence)).to.be.true;

      if (actualAccuséRéception) {
        const result = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: actualAccuséRéception.formatter(),
          },
        });

        const actualContent = await convertReadableStreamToString(result.content);
        actualContent.should.be.equal(expectedContent);
      }
     */
    return {};
  }
}
