export type CsvValidationErrorType = Array<{
  numéroLigne?: number
  valeur?: string
  erreur?: string
}>

export class CsvValidationError extends Error {
  constructor(public détails: CsvValidationErrorType) {
    super('Les données du fichier csv sont incorrectes')
  }
}
