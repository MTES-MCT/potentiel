import { OperationRejectedError } from '@potentiel-domain/core';

export class RéférenceDossierRaccordementDéjàExistantePourLeProjetError extends OperationRejectedError {
  constructor() {
    super(
      `Il est impossible d'avoir plusieurs dossiers de raccordement avec la même référence pour un projet`,
    );
  }
}
