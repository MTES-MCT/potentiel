import {
  InvalidOperationError,
  NotFoundError,
  OperationRejectedError,
} from '@potentiel/core-domain';

export class DossierRaccordementNonRéférencéError extends NotFoundError {
  constructor() {
    super(`Le dossier de raccordement n'est pas référencé`);
  }
}

export class PlusieursGestionnairesRéseauPourUnProjetError extends OperationRejectedError {
  constructor() {
    super(
      `Il est impossible de transmettre une demande complète de raccordement auprès de plusieurs gestionnaires de réseau`,
    );
  }
}

export class RéférenceDossierRaccordementDéjàExistantPourLeProjetError extends OperationRejectedError {
  constructor() {
    super(
      `Il impossible d'avoir plusieurs dossiers de raccordement avec la même référence pour un projet`,
    );
  }
}

export class FormatRéférenceDossierRaccordementInvalideError extends InvalidOperationError {
  constructor() {
    super(`Le format de la référence du dossier de raccordement est invalide`);
  }
}

export class RéférencesDossierRaccordementIdentiquesError extends InvalidOperationError {
  constructor() {
    super(`Les références du dossier de raccordement sont identiques`);
  }
}

export class DateDansLeFuturError extends InvalidOperationError {
  constructor() {
    super(`La date ne peux pas être une date future`);
  }
}
