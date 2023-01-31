import { DomainError } from '@core/domain'

export class FichierDeRéponseObligatoireError extends DomainError {
  constructor() {
    super('Le fichier de réponse est obligatoire')
  }
}
