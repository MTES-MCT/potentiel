import { DomainError } from '../../../core/domain'

export class PuissanceVariationWithDecisionJusticeError extends DomainError {
  constructor() {
    super(
      'Vous ne pouvez pas accepter une augmentation de puissance avec une variation de plus de 10% alors que vous avez indiqué que la demande fait suite à une demande de justice.'
    )
  }
}
