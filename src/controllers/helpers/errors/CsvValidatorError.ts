export class CsvValidationError extends Error {
  constructor(
    public erreurs: Array<{
      numéroLigne?: number
      valeur?: string
      erreur?: string
    }>
  ) {
    super('Une erreur est survenue lors de la validation des données')
  }
}
