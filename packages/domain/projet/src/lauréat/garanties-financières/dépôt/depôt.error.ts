import { InvalidOperationError } from '@potentiel-domain/core';

export class DépôtGarantiesFinancièresDéjàSoumisError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà des garanties financières en attente de validation pour ce projet`);
  }
}

export class DemandeMainlevéeDemandéeError extends InvalidOperationError {
  constructor() {
    super(
      'Vous ne pouvez pas déposer de nouvelles garanties financières car vous avez une demande de mainlevée de garanties financières en cours',
    );
  }
}

export class DemandeMainlevéeEnInstructionError extends InvalidOperationError {
  constructor() {
    super(
      `Vous ne pouvez pas déposer de nouvelles garanties financières car vous avez une mainlevée de garanties financières en cours d'instruction`,
    );
  }
}
