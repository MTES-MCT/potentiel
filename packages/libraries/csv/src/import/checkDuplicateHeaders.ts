export type CsvDuplicateHeaderError = string;

export class DuplicateHeaderError extends Error {
  constructor(public duplicateHeaders: Array<CsvDuplicateHeaderError>) {
    super('Des colonnes sont en doublon dans le fichier CSV');
  }
}

export const checkDuplicateHeaders = (headers: Array<string>) => {
  const duplicateHeaders = [
    ...new Set(headers.filter((item, index) => !!item && headers.indexOf(item) !== index)),
  ];

  if (duplicateHeaders.length) {
    throw new DuplicateHeaderError(duplicateHeaders);
  }
};
