import { InvalidOperationError } from '@potentiel-domain/core';

export class AppelOffreInexistantError extends InvalidOperationError {
  constructor(appelOffre: string) {
    super(`L'appel d'offre spécifié n'existe pas`, { appelOffre });
  }
}

export class PériodeInexistanteError extends InvalidOperationError {
  constructor(appelOffre: string, période: string) {
    super(`La période d'appel d'offre spécifiée n'existe pas`, { appelOffre, période });
  }
}

export class FamilleInexistanteError extends InvalidOperationError {
  constructor(appelOffre: string, période: string, famille: string) {
    super(`La famille de période d'appel d'offre spécifiée n'existe pas`, {
      appelOffre,
      période,
      famille,
    });
  }
}
