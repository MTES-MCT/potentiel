import { CsvValidationErrorFeedback } from '../guards'

export class CsvValidationError extends Error {
  constructor(public détails: CsvValidationErrorFeedback) {
    super('Les données du fichier csv sont incorrectes')
  }
}
