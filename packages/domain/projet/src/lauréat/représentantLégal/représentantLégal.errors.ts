import { InvalidOperationError } from '@potentiel-domain/core';

export class ReprésentantLégalMêmeNomError extends InvalidOperationError {
  constructor() {
    super('Le représentant légal a le même nom que celui associé au projet');
  }
}

export class ReprésentantLégalTypeInconnuError extends InvalidOperationError {
  constructor() {
    super('Le représentant légal ne peut pas avoir de type inconnu');
  }
}

export class DemandeDeChangementEnCoursError extends InvalidOperationError {
  constructor() {
    super(
      'Impossible de modifier le représentant légal car une demande de changement est déjà en cours',
    );
  }
}

export class ReprésentantLégalDéjàImportéError extends InvalidOperationError {
  constructor() {
    super('Le représentant légal a déjà été importé');
  }
}
