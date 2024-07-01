import { DateTime } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';

export class RaccordementWorld {
  #dateQualification!: DateTime.ValueType;

  get dateQualification(): DateTime.ValueType {
    if (!this.#dateQualification) {
      throw new Error('dateQualification not initialized');
    }
    return this.#dateQualification;
  }

  set dateQualification(value: DateTime.ValueType) {
    this.#dateQualification = value;
  }

  #dateSignature!: DateTime.ValueType;

  get dateSignature(): DateTime.ValueType {
    if (!this.#dateSignature) {
      throw new Error('dateSignature not initialized');
    }
    return this.#dateSignature;
  }

  set dateSignature(value: DateTime.ValueType) {
    this.#dateSignature = value;
  }

  #dateMiseEnService!: DateTime.ValueType;

  get dateMiseEnService(): DateTime.ValueType {
    if (!this.#dateMiseEnService) {
      throw new Error('dateMiseEnService not initialized');
    }
    return this.#dateMiseEnService;
  }

  set dateMiseEnService(value: DateTime.ValueType) {
    this.#dateMiseEnService = value;
  }

  #accuséRéceptionDemandeComplèteRaccordement!: { format: string; content: string };

  get accuséRéceptionDemandeComplèteRaccordement(): { format: string; content: string } {
    if (!this.#accuséRéceptionDemandeComplèteRaccordement) {
      throw new Error('accuséRéceptionDemandeComplèteRaccordement not initialized');
    }
    return this.#accuséRéceptionDemandeComplèteRaccordement;
  }

  set accuséRéceptionDemandeComplèteRaccordement(value: { format: string; content: string }) {
    this.#accuséRéceptionDemandeComplèteRaccordement = value;
  }

  #propositionTechniqueEtFinancièreSignée!: { format: string; content: string };

  get propositionTechniqueEtFinancièreSignée(): { format: string; content: string } {
    if (!this.#propositionTechniqueEtFinancièreSignée) {
      throw new Error('fichierPropositionTechniqueEtFinancière not initialized');
    }
    return this.#propositionTechniqueEtFinancièreSignée;
  }

  set propositionTechniqueEtFinancièreSignée(value: { format: string; content: string }) {
    this.#propositionTechniqueEtFinancièreSignée = value;
  }

  #référenceDossierRaccordement!: Raccordement.RéférenceDossierRaccordement.ValueType;

  get référenceDossierRaccordement(): Raccordement.RéférenceDossierRaccordement.ValueType {
    if (!this.#référenceDossierRaccordement) {
      throw new Error('référenceDossierRaccordement not initialized');
    }
    return this.#référenceDossierRaccordement;
  }

  set référenceDossierRaccordement(value: Raccordement.RéférenceDossierRaccordement.ValueType) {
    this.#référenceDossierRaccordement = value;
  }
}
