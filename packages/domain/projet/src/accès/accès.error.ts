import { InvalidOperationError } from '@potentiel-domain/core';

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
