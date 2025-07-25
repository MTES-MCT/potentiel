import { InvalidOperationError } from '@potentiel-domain/core';

export class TechnologieNonSpécifiéeError extends InvalidOperationError {
  constructor() {
    super("La technologie n'a pas été spécifiée");
  }
}
export class CahierDesChargesEmpêcheModificationError extends InvalidOperationError {
  constructor() {
    super('Le cahier des charges de ce projet ne permet pas ce changement');
  }
}
