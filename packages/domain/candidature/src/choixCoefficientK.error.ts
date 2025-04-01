import { InvalidOperationError } from '@potentiel-domain/core';

export class ChoixCoefficientKRequisError extends InvalidOperationError {
  constructor() {
    super(`Le choix du coefficient K est requis pour cette période`);
  }
}

export class ChoixCoefficientKNonAttenduError extends InvalidOperationError {
  constructor() {
    super(`Le choix du coefficient K ne peut être renseigné pour cette période`);
  }
}
