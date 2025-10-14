import { InvalidOperationError } from '@potentiel-domain/core';

export class ÉvaluationCarboneIdentiqueError extends InvalidOperationError {
  constructor() {
    super("L'évaluation carbone doit avoir une valeur différente");
  }
}

export class FournisseursIdentiqueError extends InvalidOperationError {
  constructor() {
    super('La liste des fournisseurs doit avoir une valeur différente');
  }
}

export class ChangementFournisseurValeurIdentiqueError extends InvalidOperationError {
  constructor() {
    super('Le changement de fournisseur doit contenir une modification');
  }
}

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
