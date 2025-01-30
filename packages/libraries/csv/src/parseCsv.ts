import iconv from 'iconv-lite';
import { parse } from 'csv-parse';
import * as zod from 'zod';
import { detect } from 'chardet';

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
};

export type ParseOptions = typeof defaultParseOptions & {
  encoding?: 'utf8' | 'win1252';
};

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

// https://stackoverflow.com/questions/40385133/retrieve-data-from-a-readablestream-object
function concatArrayBuffers(chunks: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
export async function streamToArrayBuffer(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return concatArrayBuffers(chunks);
}

const loadCsv = async (fileStream: ReadableStream, parseOptions: Partial<ParseOptions>) => {
  const { encoding: encodingOption, ...options } = { ...defaultParseOptions, ...parseOptions };
  const arrayBuffer = await streamToArrayBuffer(fileStream);
  const encoding = getEncoding(arrayBuffer, encodingOption);
  const decoded = iconv.decode(Buffer.from(arrayBuffer), encoding);
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

const getEncoding = (arrayBuffer: Uint8Array, expectedEncoding: ParseOptions['encoding']) => {
  if (expectedEncoding) {
    return expectedEncoding;
  }

  const encoding = detect(arrayBuffer);
  if (!encoding) {
    throw new Error('Encoding cannot be determined');
  }
  return encoding;
};
