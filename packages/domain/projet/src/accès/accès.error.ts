import { InvalidOperationError, OperationRejectedError } from '@potentiel-domain/core';

export class EmailNonCorrespondantError extends InvalidOperationError {
  constructor() {
    super("L'email du porteur ne correspond pas à l'email de la candidature");
  }
}

export class PrixEtNuméroCRENonCorrespondantError extends InvalidOperationError {
  constructor() {
    super('Le prix et le numéro CRE spécifiés ne correspondent pas à ceux de la candidature');
  }
}

export class ProjetNonNotiféError extends InvalidOperationError {
  constructor() {
    super("Le projet n'est pas notifié");
  }
}

export class RetraitDeSesAccèsProjetError extends InvalidOperationError {
  constructor() {
    super('Vous ne pouvez pas retirer vos accès à ce projet');
  }
}

export class UtilisateurAPasAccèsAuProjetError extends InvalidOperationError {
  constructor() {
    super("L'utilisateur n'a pas accès au projet");
  }
}

export class AccèsProjetDéjàAutoriséError extends OperationRejectedError {
  constructor() {
    super(`L'utilisateur a déjà accès à ce projet`);
  }
}

export class ProjetNonRéclamableError extends OperationRejectedError {
  constructor() {
    super(`Le projet ne peut être réclamé`);
  }
}
