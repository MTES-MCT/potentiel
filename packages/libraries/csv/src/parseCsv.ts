import { Readable } from 'node:stream';

import iconv from 'iconv-lite';
import { parse } from 'csv-parse';
import * as zod from 'zod';

export type CsvError = {
  line: string;
  field: string;
  message: string;
};

export class CsvValidationError extends Error {
  constructor(public errors: Array<CsvError>) {
    super('Erreur lors de la validation du fichier CSV');
  }
}

const defaultParseOptions = {
  delimiter: ';',
  columns: true,
  ltrim: true,
  rtrim: true,
  skip_empty_lines: true,
  skip_records_with_empty_values: true,
  encoding: 'win1252' as 'utf8' | 'win1252',
};

export type ParseOptions = typeof defaultParseOptions;

type ParseCsv = <TSchema extends zod.ZodTypeAny>(
  fileStream: ReadableStream,
  lineSchema: TSchema,
  parseOptions?: Partial<ParseOptions>,
) => Promise<{
  parsedData: ReadonlyArray<zod.infer<TSchema>>;
  rawData: ReadonlyArray<Record<string, string>>;
}>;

export const parseCsv: ParseCsv = async (
  fileStream,
  lineSchema,
  parseOptions: Partial<ParseOptions> = {},
) => {
  const rawData = await loadCsv(fileStream, parseOptions);

  try {
    return { parsedData: zod.array(lineSchema).parse(rawData), rawData };
  } catch (error) {
    if (error instanceof zod.ZodError) {
      const csvErrors = error.errors.map(({ path: [ligne, key], message }) => {
        return {
          line: (Number(ligne) + 1).toString(),
          field: key.toString(),
          message,
        };
      });

      throw new CsvValidationError(csvErrors);
    }

    throw error;
  }
};

const loadCsv = (fileStream: ReadableStream, parseOptions: Partial<typeof defaultParseOptions>) => {
  return new Promise<Array<Record<string, string>>>((resolve, reject) => {
    const data: Array<Record<string, string>> = [];
    const { encoding, ...options } = { ...defaultParseOptions, ...parseOptions };
    const decode = iconv.decodeStream(encoding);

    webRSToNodeRS(fileStream)
      .pipe(decode)
      .pipe(parse(options))
      .on('data', (row: Record<string, string>) => {
        data.push(row);
      })
      .on('error', (e) => {
        reject(e);
      })
      .on('end', () => {
        resolve(data);
      });
  });
};

const webRSToNodeRS = (rs: ReadableStream): NodeJS.ReadableStream => {
  const reader = rs.getReader();
  const out = new Readable();
  reader.read().then(async ({ value, done }) => {
    while (!done) {
      out.push(value);
      ({ done, value } = await reader.read());
    }
    out.push(null);
  });
  return out;
};
