import { DomainError } from '@core/domain'

export class AppelOffreDoesNotExistError extends DomainError {
  constructor(public appelOffreId: string, public lineNumber: number) {
    super(
      `L‘appel offre ${appelOffreId} mentionné à la ligne ${lineNumber} n‘existe pas. Merci de le créer avant d‘importer ses périodes.`
    )
  }
}
