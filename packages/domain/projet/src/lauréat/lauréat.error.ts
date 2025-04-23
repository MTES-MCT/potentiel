import { AggregateNotFoundError, InvalidOperationError } from '@potentiel-domain/core';

export class LauréatNonTrouvéError extends AggregateNotFoundError {
  constructor() {
    super(`Le projet lauréat n'existe pas`);
  }
}

export class LauréatDéjàNotifiéError extends InvalidOperationError {
  constructor() {
    super(`Le projet lauréat est déjà notifié`);
  }
}
