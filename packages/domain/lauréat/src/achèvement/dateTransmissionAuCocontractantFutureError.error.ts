import { InvalidOperationError } from '@potentiel-domain/core';

export class DateDeTransmissionAuCoContractantFuturError extends InvalidOperationError {
  constructor() {
    super('la date de transmission au co-contractant ne peut pas être une date future');
  }
}
