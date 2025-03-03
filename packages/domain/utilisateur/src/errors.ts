import { OperationRejectedError } from '@potentiel-domain/core';

export class RoleRefuséError extends OperationRejectedError {
  constructor(value: string) {
    super(`Le rôle ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

export class AccèsFonctionnalitéRefuséError extends OperationRejectedError {
  constructor(fonctionnalité: string, role: string) {
    super(`Accès à la fonctionnalité refusé`, {
      fonctionnalité,
      role,
    });
  }
}
export class GroupeRefuséError extends OperationRejectedError {
  constructor(value: string) {
    super(`Le groupe ne correspond à aucun format connu`, {
      value,
    });
  }
}

export class AccèsProjetDéjàAutorisé extends OperationRejectedError {
  constructor() {
    super(`L'utilisateur a déjà accès à ce projet`);
  }
}
