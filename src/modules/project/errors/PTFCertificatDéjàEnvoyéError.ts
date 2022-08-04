import { DomainError } from '@core/domain'

export class PTFCertificatDéjàEnvoyéError extends DomainError {
  constructor() {
    super(
      'Un document est déjà enregistré pour la proposition technique et financière de ce projet.'
    )
  }
}
