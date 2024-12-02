import { DomainError } from '@potentiel-domain/core';

export class ReprésentantLégalIdentifiqueError extends DomainError {
  constructor() {
    super('Le représentant légal est identique à celui déjà associé au projet');
  }
}
