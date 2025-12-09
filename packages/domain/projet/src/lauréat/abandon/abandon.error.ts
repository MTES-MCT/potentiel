import { AggregateNotFoundError, InvalidOperationError } from '@potentiel-domain/core';

export class AucunAbandonEnCours extends AggregateNotFoundError {
  constructor() {
    super(`Aucune demande d'abandon n'est en cours`);
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

export class PreuveRecandidautreDéjàTransmise extends InvalidOperationError {
  constructor() {
    super('La preuve de recandidature a déjà été transmise');
  }
}

export class AbandonPasDansUnContexteDeRecandidatureError extends InvalidOperationError {
  constructor() {
    super(`Il est impossible de transmettre une preuve pour un abandon sans recandidature`);
  }
}

export class TranmissionPreuveRecandidatureImpossibleError extends InvalidOperationError {
  constructor() {
    super(
      `Il est impossible de transmettre une preuve de recandidature pour un abandon non accordé`,
    );
  }
}

export class ProjetNonNotifiéError extends InvalidOperationError {
  constructor() {
    super(`Il est impossible de transmettre une preuve de recandidature non notifiée`);
  }
}

export class ProjetNotifiéAvantLaDateMinimumError extends InvalidOperationError {
  constructor() {
    super(
      `Il est impossible de transmettre comme preuve de recandidature un projet ayant été notifié avant le 15/12/2023`,
    );
  }
}

export class ProjetNotifiéAprèsLaDateMaximumError extends InvalidOperationError {
  constructor() {
    super(
      `Il est impossible de transmettre comme preuve de recandidature un projet ayant été notifié après le 31/03/2025`,
    );
  }
}

export class AbandonDéjàEnInstructionAvecLeMêmeAdministrateurError extends InvalidOperationError {
  constructor() {
    super("La demande d'abandon est déjà en instruction avec le même administrateur");
  }
}

export class ProjetAbandonnéError extends InvalidOperationError {
  constructor() {
    super('Le projet est abandonné');
  }
}
