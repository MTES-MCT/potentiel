import { AggregateNotFoundError, InvalidOperationError } from '@potentiel-domain/core';

export class AucunAbandonEnCours extends AggregateNotFoundError {
  constructor() {
    super(`Aucun abandon n'est en cours`);
  }
}

export class PièceJustificativeObligatoireError extends InvalidOperationError {
  constructor() {
    super('La pièce justificative est obligatoire');
  }
}

export class DateLégaleTransmissionPreuveRecandidatureDépasséeError extends InvalidOperationError {
  constructor() {
    super('Impossible de demander la preuve de recandidature au porteur après le 30/06/2025');
  }
}

export class DemandePreuveRecandidautreDéjàTransmise extends InvalidOperationError {
  constructor() {
    super('La preuve de recandidature a déjà été transmise');
  }
}
