import { InvalidOperationError } from '@potentiel-domain/core';

export class AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError extends InvalidOperationError {
  constructor() {
    super(`Il n'y a aucun dépôt de garanties financières en cours pour ce projet`);
  }
}
