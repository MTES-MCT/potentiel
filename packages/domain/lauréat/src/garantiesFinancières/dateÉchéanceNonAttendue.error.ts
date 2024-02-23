import { InvalidOperationError } from '@potentiel-domain/core';

export class DateÉchéanceNonAttendue extends InvalidOperationError {
  constructor() {
    super(`Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières`);
  }
}
