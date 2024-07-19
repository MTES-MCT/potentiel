import { InvalidOperationError } from '@potentiel-domain/core';

export class AucunesGarantiesFinancièresValidéesError extends InvalidOperationError {
  constructor() {
    super(`Il n'y a aucunes garanties financières validées pour ce projet`);
  }
}
