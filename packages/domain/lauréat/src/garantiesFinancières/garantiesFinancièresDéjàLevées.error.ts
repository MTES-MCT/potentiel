import { InvalidOperationError } from '@potentiel-domain/core';

export class GarantiesFinancièresDéjàLevéesError extends InvalidOperationError {
  constructor() {
    super(
      'Vous ne pouvez pas déposer ou modifier des garanties financières car elles ont déjà été levées pour ce projet',
    );
  }
}
