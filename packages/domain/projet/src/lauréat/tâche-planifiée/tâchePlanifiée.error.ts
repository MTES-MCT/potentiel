import { InvalidOperationError } from '@potentiel-domain/core';

export class TâcheDéjàExécutéeError extends InvalidOperationError {
  constructor() {
    super('La tâche planifiée est déjà exécutée');
  }
}

export class TâcheAnnuléeError extends InvalidOperationError {
  constructor() {
    super('La tâche planifiée est annulée');
  }
}
