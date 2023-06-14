export class RaccordementWorld {
  #dateQualification!: Date;

  get dateQualification(): Date {
    if (!this.#dateQualification) {
      throw new Error('dateQualification not initialized');
    }
    return this.#dateQualification;
  }

  set dateQualification(value: Date) {
    this.#dateQualification = value;
  }

  #dateSignature!: Date;

  get dateSignature(): Date {
    if (!this.#dateSignature) {
      throw new Error('dateSignature not initialized');
    }
    return this.#dateSignature;
  }

  set dateSignature(value: Date) {
    this.#dateSignature = value;
  }

  #dateMiseEnService!: Date;

  get dateMiseEnService(): Date {
    if (!this.#dateMiseEnService) {
      throw new Error('dateMiseEnService not initialized');
    }
    return this.#dateMiseEnService;
  }

  set dateMiseEnService(value: Date) {
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

  #référenceDossierRaccordement!: string;

  get référenceDossierRaccordement(): string {
    if (!this.#référenceDossierRaccordement) {
      throw new Error('référenceDossierRaccordement not initialized');
    }
    return this.#référenceDossierRaccordement;
  }

  set référenceDossierRaccordement(value: string) {
    this.#référenceDossierRaccordement = value;
  }
}
