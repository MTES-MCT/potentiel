import * as zod from 'zod';

import { loadCsv } from './loadCsv';
import { verifyColumns } from './verifyColumns';

export type CsvLineError = {
  line: string;
  field: string;
  message: string;
};

export class CsvLineValidationError extends Error {
  constructor(public errors: Array<CsvLineError>) {
    super('Erreur lors de la validation du fichier CSV');
  }
}

export const defaultParseOptions = {
  delimiter: [',', ';', '\t'] as string[] | string,
  columns: true,
  ltrim: true,
  rtrim: true,
  skip_empty_lines: true,
  skip_records_with_empty_values: true,
};

export type ParseOptions = typeof defaultParseOptions & {
  encoding?: 'utf8' | 'win1252';
};

type ParseCsv = <TSchema extends zod.ZodTypeAny>(args: {
  fileStream: ReadableStream;
  lineSchema: TSchema;
  parseOptions?: Partial<ParseOptions>;
  columnsToVerify?: ReadonlyArray<string>;
}) => Promise<{
  parsedData: ReadonlyArray<zod.infer<TSchema>>;
  rawData: ReadonlyArray<Record<string, string>>;
}>;

export const parseCsv: ParseCsv = async ({
  fileStream,
  lineSchema,
  parseOptions,
  columnsToVerify,
}) => {
  try {
    const rawData = await loadCsv(fileStream, parseOptions ?? {});

    verifyColumns(rawData, columnsToVerify ?? []);

    return { parsedData: zod.array(lineSchema).parse(rawData), rawData };
  } catch (error) {
    if (error instanceof zod.ZodError) {
      const csvErrors: Array<CsvLineError> = error.issues.map(
        ({ path: [ligne, key], message }) => ({
          line: (Number(ligne) + 1).toString(),
          field: key.toString(),
          message,
        }),
      );

      throw new CsvLineValidationError(csvErrors);
    }

    throw error;
  }
};
