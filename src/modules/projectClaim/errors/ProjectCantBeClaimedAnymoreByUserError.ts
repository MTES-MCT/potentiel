import { DomainError } from '@core/domain'

export class ProjectCannotBeClaimedByUserAnymoreError extends DomainError {
  constructor(projectName: string) {
    super(
      `[${projectName}] Vous vous êtes trompé à trois reprises en rentrant les informations du projet. Vous ne pouvez plus le réclamer.`
    )
  }
}
