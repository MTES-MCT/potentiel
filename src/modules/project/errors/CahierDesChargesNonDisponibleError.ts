import { DomainError } from '../../../core/domain';

export class CahierDesChargesNonDisponibleError extends DomainError {
  constructor() {
    super(`Le cahier des charges choisi n'est pas disponible pour cet appel d'offres.`);
  }
}
