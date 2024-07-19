import { AggregateNotFoundError } from '@potentiel-domain/core';

export class AucunesGarantiesFinancièresValidéesError extends AggregateNotFoundError {
  constructor() {
    super(`Il n'y a aucunes garanties financières validées pour ce projet`);
  }
}
