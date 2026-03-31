import { mapDateTime, mapToExemple } from '#helpers';

import {
  ModifierPropositionTechniqueEtFinancière,
  ModifierPropositionTechniqueEtFinancièreFixture,
} from './fixtures/modifierPropositionTechniqueEtFinancière.fixture.js';
import {
  TransmettrePropositionTechniqueEtFinancière,
  TransmettrePropositionTechniqueEtFinancièreFixture,
} from './fixtures/transmettrePropositionTechniqueEtFinancière.fixture.js';

export class PropositionTechniqueEtFinancièreWorld {
  readonly transmettreFixture = new TransmettrePropositionTechniqueEtFinancièreFixture();
  readonly modifierFixture = new ModifierPropositionTechniqueEtFinancièreFixture();

  mapToExpected(nouvelleRéférenceDossier: string | undefined) {
    return (
      this.modifierFixture.mapToExpected(nouvelleRéférenceDossier) ??
      this.transmettreFixture.mapToExpected(nouvelleRéférenceDossier)
    );
  }
  mapExempleToFixtureValues(exemple: Record<string, string>) {
    return mapToExemple<
      TransmettrePropositionTechniqueEtFinancière & ModifierPropositionTechniqueEtFinancière
    >(exemple, {
      dateSignature: ['La date de signature', mapDateTime],
      référenceDossier: ['La référence du dossier de raccordement'],
    });
  }
}
