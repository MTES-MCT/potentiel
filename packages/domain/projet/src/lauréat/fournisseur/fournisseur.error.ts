import { InvalidOperationError } from '@potentiel-domain/core';

export class ChangementFournisseurChampsManquantsError extends InvalidOperationError {
  constructor() {
    super('Le changement de fournisseur doit contenir une raison et une pièce justificative');
  }
}

export class ÉvaluationCarboneNégativeError extends InvalidOperationError {
  constructor() {
    super("L'évaluation carbone ne peut être négative");
  }
}

export class ÉvaluationCarboneNombreError extends InvalidOperationError {
  constructor() {
    super("L'évaluation carbone doit être un nombre");
  }
}
