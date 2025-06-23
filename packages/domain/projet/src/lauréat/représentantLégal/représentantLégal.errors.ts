import { InvalidOperationError } from '@potentiel-domain/core';

export class ReprésentantLégalIdentiqueError extends InvalidOperationError {
  constructor() {
    super('Le représentant légal est identique à celui déjà associé au projet');
  }
}

export class ReprésentantLégalTypeInconnuError extends InvalidOperationError {
  constructor() {
    super('Le représentant légal ne peut pas avoir de type inconnu');
  }
}

export class ProjetAchevéError extends InvalidOperationError {
  constructor() {
    super('Impossible de demander le changement de représentant légal pour un projet achevé');
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
