import { DomainError } from '../../../core/domain';

export class CahierDesChargesInitialNonDisponibleError extends DomainError {
  constructor() {
    super('Impossible de revenir au cahier de charges en vigueur à la candidature');
  }
}
