import { DomainError } from '@core/domain'

export class AttachmentRequiredForDemandeRecoursAcceptedError extends DomainError {
  constructor() {
    super(
      `Lors d'un signalement d'une demande de recours acceptée, le courrier de réponse est obligatoire.`
    )
  }
}
