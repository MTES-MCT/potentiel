import { ModifierPropositionTechniqueEtFinancièreFixture } from './fixtures/modifierPropositionTechniqueEtFinancière.fixture';
import { TransmettrePropositionTechniqueEtFinancièreFixture } from './fixtures/transmettrePropositionTechniqueEtFinancière.fixture';

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
