import iconv from 'iconv-lite'
import csvParse from 'csv-parse'
import fs from 'fs'

export const parseCsv = (file) =>
  new Promise<Array<Record<string, string>>>((resolve, reject) => {
    const data: Array<Record<string, string>> = []
    const from1252 = iconv.decodeStream('win1252')
    fs.createReadStream(file)
      .pipe(from1252)
      .pipe(
        csvParse({
          delimiter: ';',
          columns: true,
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
  })
