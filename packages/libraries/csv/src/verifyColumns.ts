export type CsvColumnError = {
  column: string;
};

export class CsvColumnValidationError extends Error {
  constructor(public errors: Array<CsvColumnError>) {
    super('Des colonnes sont manquantes dans le fichier CSV');
  }
}

export const verifyColumns = (
  rawData: ReadonlyArray<Record<string, string>>,
  columnsToVerify: ReadonlyArray<string>,
) => {
  if (columnsToVerify.length === 0) {
    return;
  }

  const missingColumns = columnsToVerify.filter((col) => !Object.keys(rawData[0]).includes(col));
  if (missingColumns.length > 0) {
    const errors: CsvColumnError[] = missingColumns.map((column) => ({
      column,
    }));
    throw new CsvColumnValidationError(errors);
  }
};
