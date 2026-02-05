export type CsvMissingColumnError = {
  column: string;
};

export class MissingRequiredColumnError extends Error {
  constructor(public errors: Array<CsvMissingColumnError>) {
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

  const missingColumns = requiredColumns.filter((col) => !Object.keys(rawData[0]).includes(col));
  if (missingColumns.length > 0) {
    const errors: CsvMissingColumnError[] = missingColumns.map((column) => ({
      column,
    }));
    throw new MissingRequiredColumnError(errors);
  }
};
