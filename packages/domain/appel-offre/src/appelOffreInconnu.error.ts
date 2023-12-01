import { NotFoundError } from '@potentiel-domain/core';

export class AppelOffreInconnuErreur extends NotFoundError {
  constructor() {
    super(`Appel d'offres inconnu`);
  }
}
