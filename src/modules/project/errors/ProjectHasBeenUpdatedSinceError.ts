import { DomainError } from '@core/domain'

export class ProjectHasBeenUpdatedSinceError extends DomainError {
  constructor() {
    super(
      'Le projet a été mis à jour par un autre utilisateur. Merci de rafraichir et de refaire la demande.'
    )
  }
}
