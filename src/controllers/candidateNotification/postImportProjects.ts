import asyncHandler from 'express-async-handler'
import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { parseCsv } from '../../helpers/parseCsv'
import routes from '../../routes'
import { importProjects } from '../../config'
import { ImportCandidatesPage } from '../../views/legacy-pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { upload } from '../upload'
import { v1Router } from '../v1Router'
import { UniqueEntityID } from '../../core/domain'
import { IllegalProjectDataError } from '../../modules/project'

v1Router.post(
  routes.IMPORT_PROJECTS_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec']),
  upload.single('candidats'),
  asyncHandler(async (request, response) => {
    if (!request.file || !request.file.path) {
      return response.redirect(
        addQueryParams(routes.IMPORT_PROJECTS, {
          error: 'Le fichier candidat est manquant.',
        })
      )
    }

    // Parse the csv file
    const linesResult = await parseCsv(request.file.path, { delimiter: ';', encoding: 'win1252' })
    if (linesResult.isErr()) {
      const csvError = linesResult.error
      return response.redirect(
        addQueryParams(routes.IMPORT_PROJECTS, {
          error: `Le fichier csv n'a pas pu être importé: ${csvError.message}`,
        })
      )
    }

    const importId = new UniqueEntityID().toString()

    try {
      await importProjects({
        lines: linesResult.value,
        importedBy: request.user,
        importId,
      })

      return response.send(ImportCandidatesPage({ request, isSuccess: true }))
    } catch (e) {
      if (e instanceof IllegalProjectDataError) {
        return response.send(ImportCandidatesPage({ request, importErrors: e.errors }))
      }

      return response.send(ImportCandidatesPage({ request, otherError: e.message }))
    }
  })
)
