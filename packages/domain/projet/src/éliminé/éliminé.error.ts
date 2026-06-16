import { AggregateNotFoundError } from '@potentiel-domain/core';

export class ÉliminéNonNotifiéError extends AggregateNotFoundError {
  constructor() {
    super(`Le projet lauréat n'existe pas`);
  }
}
