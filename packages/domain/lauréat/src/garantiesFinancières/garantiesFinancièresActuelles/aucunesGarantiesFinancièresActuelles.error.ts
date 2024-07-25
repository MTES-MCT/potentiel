import { InvalidOperationError } from '@potentiel-domain/core';

export class AucunesGarantiesFinancièresActuellesError extends InvalidOperationError {
  constructor() {
    super(`Il n'y a aucunes garanties financières actuelles pour ce projet`);
  }
}
