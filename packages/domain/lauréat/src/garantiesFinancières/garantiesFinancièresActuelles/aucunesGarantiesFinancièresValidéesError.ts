import { NotFoundError } from '@potentiel-domain/core';

export class AucunesGarantiesFinancièresValidéesError extends NotFoundError {
  constructor() {
    super(`Il n'y a aucunes garanties financières validées pour ce projet`);
  }
}
