import { Readable } from 'node:stream';

import iconv from 'iconv-lite';
import { parse } from 'csv-parse';

export const parseCsv = (fileStream: ReadableStream) => {
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
