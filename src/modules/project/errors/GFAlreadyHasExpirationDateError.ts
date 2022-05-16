import { DomainError } from '@core/domain'

export class GFAlreadyHasExpirationDateError extends DomainError {
  constructor() {
    super(
      "Nous n'avons pas pu enregistrer la date d'expiration renseignée car l'attestation de garanties financières a déjà une date d'expiration associée."
    )
  }
}
