import { InvalidOperationError } from '@potentiel-domain/core';

export class CandidatureDéjàImporterError extends InvalidOperationError {
  constructor() {
    super("Il est impossible d'importer 2 fois la même candidature");
  }
}
