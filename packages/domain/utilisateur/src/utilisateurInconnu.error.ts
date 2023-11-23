import { NotFoundError } from '@potentiel-domain/core';

export class UtilisateurInconnuErreur extends NotFoundError {
  constructor() {
    super(`Utilisateur inconnu`);
  }
}
