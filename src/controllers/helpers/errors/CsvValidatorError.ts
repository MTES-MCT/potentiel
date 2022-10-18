type CsvValidationErrorType = {
  numéroLigne: number
  valeurInvalide?: string
  raison: string
}

export class CsvValidationError extends Error {
  constructor(public détails?: Array<CsvValidationErrorType>) {
    super('Les données du fichier csv sont incorrectes')
  }
}
