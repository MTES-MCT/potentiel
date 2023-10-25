import { DomainError } from '../../../../core/domain';

export class CorrectionDélaiNonAccordéImpossibleError extends DomainError {
  constructor() {
    super(`Vous ne pouvez pas corriger un délai qui n'a pas le statut "accordé".`);
  }
}
