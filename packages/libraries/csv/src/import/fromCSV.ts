import iconv from 'iconv-lite';
import { parse } from 'csv-parse';
import * as zod from 'zod';

import { streamToArrayBuffer } from './streamToArrayBuffer.js';
import { getEncoding } from './getEncoding.js';
import { checkRequiredColumns } from './checkRequiredColumns.js';
import { checkDuplicateHeaders } from './checkDuplicateHeaders.js';

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

const defaultParseOptions = {
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

type FromCSV = <TSchema extends zod.ZodTypeAny>(
  fileStream: ReadableStream,
  lineSchema: TSchema,
  parseOptions?: Partial<ParseOptions>,
  requiredColumns?: ReadonlyArray<string>,
) => Promise<{
  parsedData: ReadonlyArray<zod.infer<TSchema>>;
  rawData: ReadonlyArray<Record<string, string>>;
}>;

export const fromCSV: FromCSV = async (
  fileStream,
  lineSchema,
  parseOptions: Partial<ParseOptions> = {},
  requiredColumns,
) => {
  try {
    const rawData = await loadCSV(fileStream, parseOptions);

    checkRequiredColumns(rawData, requiredColumns ?? []);

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

const loadCSV = async (fileStream: ReadableStream, parseOptions: Partial<ParseOptions>) => {
  const { encoding: encodingOption, ...options } = { ...defaultParseOptions, ...parseOptions };
  const arrayBuffer = await streamToArrayBuffer(fileStream);
  const encoding = getEncoding(arrayBuffer, encodingOption);
  const decoded = iconv.decode(Buffer.from(arrayBuffer), encoding);
  const [headerRow] = await new Promise<string[][]>((resolve, reject) => {
    parse(decoded, { ...options, columns: false }, (err, records) => {
      if (err) reject(err);
      else resolve(records.slice(0, 1));
    });
  });

  checkDuplicateHeaders(headerRow);

  const rows = await new Promise<Record<string, string>[]>((resolve, reject) =>
    parse(decoded, options, (err, records) => {
      if (err) reject(err);
      else {
        resolve(records);
      }
    }),
  );
  return rows;
};
