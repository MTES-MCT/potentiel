import iconv from 'iconv-lite'
import csvParse from 'csv-parse'
import fs from 'fs'
import { ResultAsync } from '../core/utils'
interface parseCsvOptions {
  delimiter: string
}

export const parseCsv = (file, options?: parseCsvOptions) =>
  ResultAsync.fromPromise(
    new Promise<Array<Record<string, string>>>((resolve, reject) => {
      const data: Array<Record<string, string>> = []
      const from1252 = iconv.decodeStream('win1252')
      fs.createReadStream(file)
        .pipe(from1252)
        .pipe(
          csvParse({
            delimiter: options?.delimiter || ';',
            columns: true,
            ltrim: true,
            rtrim: true,
            skip_empty_lines: true,
            skip_lines_with_empty_values: true,
          })
        )
        .on('data', (row: Record<string, string>) => {
          data.push(row)
        })
        .on('error', (e) => {
          reject(e)
        })
        .on('end', () => {
          resolve(data)
        })
    }),
    (e: Error) => e
  )
