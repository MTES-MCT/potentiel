import asyncHandler from 'express-async-handler'
import fs from 'fs'
import moment from 'moment'
import { submitStep } from '../../config/useCases.config'
import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { pathExists } from '../../helpers/pathExists'
import routes from '../../routes'
import { ensureLoggedIn, ensureRole } from '../auth'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.DEPOSER_ETAPE_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    const { type, ptfDate, projectId } = request.body

    if (!projectId || !['ptf'].includes(type)) {
      return response.status(400).send('Requête erronée')
    }

    if (type === 'ptf' && !ptfDate) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error: "Votre dépôt n'a pas pu être transmis. La date est obligatoire.",
        })
      )
    }

    // Convert date
    try {
      if (ptfDate) {
        if (!moment(ptfDate, 'DD/MM/YYYY').isValid()) throw new Error('invalid date format')
      }
    } catch (error) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre dépôt n'a pas pu être transmis. La date envoyée n'est pas au bon format (JJ/MM/AAAA)",
        })
      )
    }

    const attestationExists: boolean = !!request.file && (await pathExists(request.file.path))

    if (!attestationExists) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre dépôt n'a pas pu être transmis. Merci de joindre l'attestation en pièce-jointe.",
        })
      )
    }

    const file = {
      contents: fs.createReadStream(request.file.path),
      filename: `${Date.now()}-${request.file.originalname}`,
    }

    ;(
      await submitStep({
        type: 'ptf',
        projectId,
        stepDate: moment(ptfDate, 'DD/MM/YYYY').toDate(),
        file,
        submittedBy: request.user,
      })
    ).match(
      () =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            success: 'Votre dépôt a bien été enregistré.',
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
