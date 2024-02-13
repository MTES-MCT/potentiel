import { DomainError } from '../../../core/domain';

export class PasDePermissionPourChangerTypeGFError extends DomainError {
  constructor() {
    super("Vous n'avez pas l'autorisation pour ajouter le type de garanties financières.");
  }
}
