import { promises as fsPromises } from 'fs'
import { encode } from 'iconv-lite'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { dataFieldsFlattened } from '../dataAccess/inMemory/appelsOffres'
import { Project } from '../entities'

export async function writeCsvOnDisk(csv: string, csvSaveDir: string): Promise<string> {
  const csvUtf8Bom = encode(csv, 'utf-8', { addBOM: true })
  const fileName = path.join(csvSaveDir, `${uuid()}.csv`)
  await fsPromises.writeFile(fileName, csvUtf8Bom)
  return fileName
}

export function formatField(field: {
  name: string
  fn?: (project: Project) => any
}): { label: string; value: string | ((project: Project) => any) } {
  const { name, fn } = field

  if (fn) return { label: name, value: fn }

  return dataFieldsFlattened.has(name)
    ? { label: dataFieldsFlattened.get(name) as string, value: name }
    : { label: name, value: `details.${name}` }
}
