import csvParse from 'csv-parse'
import fs from 'fs'
import iconv from 'iconv-lite'
import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { importProjects } from '../useCases'
import { logger } from '../core/utils'

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
        data.push(row)
      })
      .on('error', (e) => {
        reject(e)
      })
      .on('end', () => {
        resolve(data)
      })
  })

const postProjects = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  if (!request.file || !request.file.path) {
    return Redirect(ROUTES.IMPORT_PROJECTS, {
      error: 'Le fichier candidat est manquant.',
    })
  }

  // Parse the csv file
  const lines = await parse(request.file.path)

  const importProjectsResult = await importProjects({
    lines,
    userId: request.user.id,
  })

  return importProjectsResult.match({
    ok: (result) => {
      const { unnotifiedProjects, savedProjects } = result || {}
      return Redirect(ROUTES.IMPORT_PROJECTS, {
        success: savedProjects
          ? `${savedProjects} projet(s) ont bien été importé(s) ou mis à jour${
              unnotifiedProjects ? ` dont ${unnotifiedProjects} à notifier` : ''
            }.`
          : "L'import est un succès mais le fichier importé n'a pas donné lieu à des changements dans la base de projets.",
      })
    },
    err: (e: Error) => {
      logger.error(e)
      return Redirect(ROUTES.IMPORT_PROJECTS, {
        error: e.message.length > 1000 ? e.message.substring(0, 1000) + '...' : e.message,
      })
    },
  })
}
export { postProjects }
