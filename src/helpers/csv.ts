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

export function formatField(
  field:
    | {
        label: string
        value: (project: Project) => any
      }
    | { dataField: string }
): { label: string; value: string | ((project: Project) => any) } {
  if ('value' in field) return { label: field.label, value: field.value }

  const dataField = field.dataField

  return dataFieldsFlattened.has(dataField)
    ? { label: dataFieldsFlattened.get(dataField) as string, value: dataField }
    : { label: dataField, value: `details.${dataField}` }
}
