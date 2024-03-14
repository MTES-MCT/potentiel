import { DomainError } from '../../../../core/domain';

export class CorrectionDélaiImpossibleCarProjetNonClasséError extends DomainError {
  constructor() {
    super(`Vous ne pouvez pas corriger ce délai car le projet doit être lauréat et actif.`);
  }
}
