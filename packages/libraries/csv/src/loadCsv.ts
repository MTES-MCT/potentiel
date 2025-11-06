import iconv from 'iconv-lite';
import { parse } from 'csv-parse';

import { getEncoding } from './getEncoding';
import { defaultParseOptions, ParseOptions } from './parseCsv';
import { streamToArrayBuffer } from './streamToArrayBuffer';

export const loadCsv = async (fileStream: ReadableStream, parseOptions: Partial<ParseOptions>) => {
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
