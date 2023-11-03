import { DomainError } from '../../../../core/domain';

export class NouvelleCorrectionDélaiAccordéImpossible extends DomainError {
  constructor() {
    super(`Vous ne pouvez pas corriger de nouveau ce délai.`);
  }
}
