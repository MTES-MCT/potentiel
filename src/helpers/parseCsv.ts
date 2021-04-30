import iconv from 'iconv-lite'
import csvParse from 'csv-parse'
import fs from 'fs'
import { ResultAsync } from '../core/utils'
interface parseCsvOptions {
  delimiter?: ',' | ';'
  encoding?: 'win1252' | 'utf8'
}

export const parseCsv = (file, options?: parseCsvOptions) =>
  ResultAsync.fromPromise(
    new Promise<Array<Record<string, string>>>((resolve, reject) => {
      const data: Array<Record<string, string>> = []
      const decode = iconv.decodeStream(options?.encoding || 'utf8')
      fs.createReadStream(file)
        .pipe(decode)
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
