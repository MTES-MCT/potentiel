import { NotFoundError } from '@potentiel-domain/core';

export class AucunesGarantiesFinancièresÀTraiter extends NotFoundError {
  constructor() {
    super(`Il n'y a aucunes garanties financières à traiter pour ce projet`);
  }
}
