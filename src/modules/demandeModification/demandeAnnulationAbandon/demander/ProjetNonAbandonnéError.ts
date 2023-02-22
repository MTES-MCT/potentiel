import { DomainError } from '@core/domain';

export class ProjetNonAbandonnéError extends DomainError {
  constructor(public projetId: string) {
    super(`Votre demande n'a pas pu être prise en compte car le projet n'est pas abandonné.`);
  }
}
