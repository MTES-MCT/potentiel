export class CsvValidationError extends Error {
  constructor(
    public détails: Array<{
      numéroLigne?: number
      valeur?: string
      erreur?: string
    }>
  ) {
    super('Les données du fichier csv sont incorrectes')
  }
}
