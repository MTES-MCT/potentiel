import { DomainError } from '@core/domain'

export class AggregateHasBeenUpdatedSinceError extends DomainError {
  constructor() {
    super("L'objet à sauvegarder a été modifié entre temps.")
  }
}
