import { DomainError } from '../../../core/domain';

export class GFImpossibleASoumettreError extends DomainError {
  constructor() {
    super('Le statut actuel du projet ne vous permet pas de soumettre des garanties financières.');
  }
}
