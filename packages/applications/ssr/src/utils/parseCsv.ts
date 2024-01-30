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

type ParseCsv = <TSchema extends zod.AnyZodObject>(
  fileStream: ReadableStream,
  lineSchema: TSchema,
) => Promise<ReadonlyArray<zod.infer<TSchema>>>;

export const parseCsv: ParseCsv = async (fileStream, lineSchema) => {
  const data = await loadCsv(fileStream);

  try {
    return zod.array(lineSchema).nonempty().parse(data);
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

const loadCsv = (fileStream: ReadableStream) => {
  return new Promise<Array<Record<string, string>>>((resolve, reject) => {
    const data: Array<Record<string, string>> = [];
    const decode = iconv.decodeStream('utf8');

    webRSToNodeRS(fileStream)
      .pipe(decode)
      .pipe(
        parse({
          delimiter: ';',
          columns: true,
          ltrim: true,
          rtrim: true,
          skip_empty_lines: true,
          skip_records_with_empty_values: true,
        }),
      )
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
