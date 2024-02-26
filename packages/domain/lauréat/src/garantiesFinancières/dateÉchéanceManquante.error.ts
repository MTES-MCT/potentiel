import { InvalidOperationError } from '@potentiel-domain/core';

export class DateÉchéanceManquante extends InvalidOperationError {
  constructor() {
    super(`Vous devez renseigner la date d'échéance pour ce type de garanties financières`);
  }
}
