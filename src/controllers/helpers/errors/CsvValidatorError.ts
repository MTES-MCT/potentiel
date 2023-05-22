export class CsvValidationError extends Error {
  constructor(public errors?: Map<string, string>) {
    super('Les données du fichier csv sont incorrectes');
  }
}
