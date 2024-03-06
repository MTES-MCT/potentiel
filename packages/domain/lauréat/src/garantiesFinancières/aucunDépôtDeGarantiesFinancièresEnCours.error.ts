import { NotFoundError } from '@potentiel-domain/core';

export class AucunDépôtDeGarantiesFinancièresEnCours extends NotFoundError {
  constructor() {
    super(`Il n'y a aucun dépôt de garanties financières en cours pour ce projet`);
  }
}
