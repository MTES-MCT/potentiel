import { NotFoundError } from '@potentiel-domain/core';

export class AucunesGarantiesFinancières extends NotFoundError {
  constructor() {
    super(`Il n'y a aucunes garanties financières sur le projet`);
  }
}
