import fs from 'fs'
import _ from 'lodash'
import moment from 'moment'
import { upload } from '../upload'
import { logger, pathExists } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { submitPTF } from '../../config/useCases.config'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.post(
  routes.DEPOSER_PTF_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    const { ptfDate, projectId } = request.body

    if (!ptfDate) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error: "Votre dépôt de PTF n'a pas pu être transmis. La date est obligatoire.",
        })
      )
    }

    // Convert date
    try {
      if (ptfDate) {
        const date = moment(ptfDate, 'DD/MM/YYYY')
        if (!date.isValid()) throw new Error('invalid date format')
      }
    } catch (error) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre demande de signature n'a pas pu être transmise. La date envoyée n'est pas au bon format (JJ/MM/AAAA)",
        })
      )
    }

    const attestationExists: boolean = !!request.file && (await pathExists(request.file.path))

    if (!attestationExists) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre dépôt de PTF n'a pas pu être transmise. Merci de joindre l'attestation en pièce-jointe.",
        })
      )
    }

    const file = {
      contents: fs.createReadStream(request.file.path),
      filename: `${Date.now()}-${request.file.originalname}`,
    }

    ;(
      await submitPTF({
        projectId,
        ptfDate: moment(ptfDate, 'DD/MM/YYYY').toDate(),
        file,
        submittedBy: request.user,
      })
    ).match(
      () =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            success: 'Votre dépôt de PTF a bien été enregistrée.',
          })
        ),
      (e) => {
        logger.error(e)
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            ptfDate,
            error: "Votre demande n'a pas pu être prise en compte: " + e.message,
          })
        )
      }
    )
  })
)
