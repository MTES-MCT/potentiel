import { DomainError } from '@core/domain'

export class ProjectNotQualifiedForCovidDelay extends DomainError {
  constructor() {
    super('Le délai covid ne peut pas être appliqué.')
  }
}
