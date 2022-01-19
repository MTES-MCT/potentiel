import asyncHandler from 'express-async-handler'
import { ensureRole, importProjects } from '@config'
import { UniqueEntityID } from '@core/domain'
import { addQueryParams } from '../../helpers/addQueryParams'
import { parseCsv } from '../../helpers/parseCsv'
import { IllegalProjectDataError } from '@modules/project'
import routes from '../../routes'
import { ImportCandidatesPage } from '@views/legacy-pages'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.IMPORT_PROJECTS_ACTION,
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
      return response.send(
        ImportCandidatesPage({
          request,
          otherError: `Le fichier csv n'a pas pu être importé: ${csvError.message}`,
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
