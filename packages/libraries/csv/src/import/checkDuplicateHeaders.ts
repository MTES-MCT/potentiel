export type CsvDuplicateHeaderError = {
  column: string;
};

export class DuplicateHeaderError extends Error {
  constructor(public errors: Array<CsvDuplicateHeaderError>) {
    super('Des colonnes sont en doublon dans le fichier CSV');
  }
}

export const checkDuplicateHeaders = (headers: Array<string>) => {
  const duplicateHeaders = new Set(
    headers.filter((item, index) => headers.indexOf(item) !== index),
  );
  duplicateHeaders.delete('');
  if (duplicateHeaders.size > 0) {
    const errors: CsvDuplicateHeaderError[] = [...duplicateHeaders].map((column) => ({
      column,
    }));
    throw new DuplicateHeaderError(errors);
  }
};
