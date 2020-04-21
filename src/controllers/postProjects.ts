import csvParse from 'csv-parse'
import fs from 'fs'
import util from 'util'
import iconv from 'iconv-lite'
import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { importProjects } from '../useCases'

const deleteFile = util.promisify(fs.unlink)

const parse = (file) =>
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
        console.log('stream data')
        data.push(row)
      })
      .on('error', (e) => {
        console.log('stream error')
        reject(e)
      })
      .on('end', () => {
        console.log('stream end')
        resolve(data)
      })
  })

const postProjects = async (request: HttpRequest) => {
  console.log('Call to postProjects received', request.body, request.file)

  if (!request.file || !request.file.path) {
    return Redirect(ROUTES.IMPORT_PROJECTS, {
      error: 'Le fichier candidat est manquant.',
    })
  }

  // Parse the csv file
  const lines = await parse(request.file.path)

  console.log('Done parsing file', request.file.path, 'lines', lines[0])

  const importProjectsResult = await importProjects({
    lines,
  })

  // remove temp file
  // await deleteFile(request.file.path)

  return importProjectsResult.match({
    ok: () =>
      Redirect(ROUTES.ADMIN_LIST_PROJECTS, {
        success: 'Les candidats ont bien été importés.',
      }),
    err: (e: Error) => {
      console.log('Caught an error after importProjects', e)
      return Redirect(ROUTES.IMPORT_PROJECTS, {
        error: e.message,
      })
    },
  })
}
export { postProjects }
