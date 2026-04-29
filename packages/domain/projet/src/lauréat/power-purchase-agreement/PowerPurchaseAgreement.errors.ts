import { InvalidOperationError } from '@potentiel-domain/core';

export class PowerPurchaseAgreementDéjàSignaléError extends InvalidOperationError {
  constructor() {
    super('Le projet est déjà signalé comme étant parti en PPA');
  }
}
