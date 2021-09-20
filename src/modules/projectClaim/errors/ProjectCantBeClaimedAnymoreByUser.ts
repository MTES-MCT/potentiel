import { DomainError } from '../../../core/domain'

export class ProjectCannotBeClaimedByUserAnymore extends DomainError {
  constructor() {
    super(
      'Vous vous êtes trompé à trois reprises en rentrant les informations du projet. Vous ne pouvez plus le réclamer.'
    )
  }
}
