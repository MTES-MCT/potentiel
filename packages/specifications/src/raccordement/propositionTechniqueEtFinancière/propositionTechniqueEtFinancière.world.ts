import { ModifierPropositionTechniqueEtFinancièreFixture } from './fixtures/modifierPropositionTechniqueEtFinancière.fixture.js';
import { TransmettrePropositionTechniqueEtFinancièreFixture } from './fixtures/transmettrePropositionTechniqueEtFinancière.fixture.js';

export class PropositionTechniqueEtFinancièreWorld {
  readonly transmettreFixture = new TransmettrePropositionTechniqueEtFinancièreFixture();
  readonly modifierFixture = new ModifierPropositionTechniqueEtFinancièreFixture();

  mapToExpected(nouvelleRéférenceDossier: string | undefined) {
    return (
      this.modifierFixture.mapToExpected(nouvelleRéférenceDossier) ??
      this.transmettreFixture.mapToExpected(nouvelleRéférenceDossier)
    );
  }
}
