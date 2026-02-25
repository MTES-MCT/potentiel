export type CsvMissingColumnError = string;

export class MissingRequiredColumnError extends Error {
  constructor(public missingColumns: Array<CsvMissingColumnError>) {
    super('Des colonnes sont manquantes dans le fichier CSV');
  }
}

export const checkRequiredColumns = (
  rawData: ReadonlyArray<Record<string, string>>,
  requiredColumns: ReadonlyArray<string>,
) => {
  if (requiredColumns.length === 0 || rawData.length === 0) {
    return;
  }

  const missingColumns = [...new Set(requiredColumns).difference(new Set(Object.keys(rawData[0])))];

  if (missingColumns.length) {
    throw new MissingRequiredColumnError(missingColumns);
  }
};
