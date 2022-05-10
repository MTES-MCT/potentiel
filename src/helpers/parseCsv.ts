import fs from 'fs'
import { parseCsvFromStream } from './parseCsvFromStream'
interface parseCsvOptions {
  delimiter?: ',' | ';'
  encoding?: 'win1252' | 'utf8'
}

export const parseCsv = (filePath: string, options?: parseCsvOptions) =>
  parseCsvFromStream(fs.createReadStream(filePath), options)
