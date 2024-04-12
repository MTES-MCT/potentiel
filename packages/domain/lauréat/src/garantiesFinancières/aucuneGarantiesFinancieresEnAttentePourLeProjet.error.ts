import { NotFoundError } from '@potentiel-domain/core';

export class AucuneGarantiesFinancieresEnAttentePourLeProjetError extends NotFoundError {
  constructor() {
    super(`Aucune garanties financières n'est attendu pour le projet`);
  }
}
