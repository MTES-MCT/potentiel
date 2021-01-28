import csvParse from 'csv-parse'
import fs from 'fs'
import iconv from 'iconv-lite'
import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { importProjects } from '../../useCases'
import { ensureLoggedIn, ensureRole } from '../auth'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

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

v1Router.post(
  routes.IMPORT_PROJECTS_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec']),
  upload.single('candidats'),
  async (request, response) => {
    if (!request.file || !request.file.path) {
      return response.redirect(
        addQueryParams(routes.IMPORT_PROJECTS, {
          error: 'Le fichier candidat est manquant.',
        })
      )
    }

    // Parse the csv file
    const lines = await parse(request.file.path)

    // console.log('postProject has lines count ', lines)
    ;(
      await importProjects({
        lines,
        userId: request.user.id,
      })
    ).match({
      ok: (result) => {
        const { unnotifiedProjects, savedProjects } = result || {}
        return response.redirect(
          addQueryParams(routes.IMPORT_PROJECTS, {
            success: savedProjects
              ? `${savedProjects} projet(s) ont bien été importé(s) ou mis à jour${
                  unnotifiedProjects ? ` dont ${unnotifiedProjects} à notifier` : ''
                }.`
              : "L'import est un succès mais le fichier importé n'a pas donné lieu à des changements dans la base de projets.",
          })
        )
      },
      err: (e: Error) => {
        logger.error(e)
        return response.redirect(
          addQueryParams(routes.IMPORT_PROJECTS, {
            error: e.message.length > 1000 ? e.message.substring(0, 1000) + '...' : e.message,
          })
        )
      },
    })
  }
)
