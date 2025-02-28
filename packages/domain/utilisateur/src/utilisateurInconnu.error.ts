import { InvalidOperationError } from '@potentiel-domain/core';

export class UtilisateurInconnuError extends InvalidOperationError {
  constructor() {
    super(`L'utilisateur n'est pas référencé`);
  }
}
