import { DomainError } from '@core/domain'

export class NoGFCertificateToUpdateError extends DomainError {
  constructor() {
    super(
      "Nous n'avons pas pu enregistrer la date d'expiration renseignée car aucune attestation de garanties financières n'a été trouvée pour ce projet."
    )
  }
}
