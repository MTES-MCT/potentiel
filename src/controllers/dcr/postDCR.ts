import fs from 'fs'
import _ from 'lodash'
import moment from 'moment'
import { upload } from '../upload'
import { logger } from '../../core/utils'
import { pathExists } from '../../helpers/pathExists'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { addDCR } from '../../useCases'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.post(
  routes.DEPOSER_DCR_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  upload.single('file'),

  asyncHandler(async (request, response) => {
    const data: any = _.pick(request.body, ['dcrDate', 'projectId', 'numeroDossier'])
    const { projectId } = data

    if (!data.dcrDate) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre demande de raccordement n'a pas pu être transmise. La date d'attestation est obligatoire",
        })
      )
    }

    // Convert date
    try {
      if (data.dcrDate) {
        const date = moment(data.dcrDate, 'DD/MM/YYYY')
        if (!date.isValid()) throw new Error('invalid date format')
        data.date = date.toDate().getTime()
      }
    } catch (error) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre demande de raccordement n'a pas pu être transmise. La date envoyée n'est pas au bon format (JJ/MM/AAAA)",
        })
      )
    }

    const attestationExists: boolean = !!request.file && (await pathExists(request.file.path))

    if (!attestationExists) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre demande de raccordement n'a pas pu être transmise. Merci de joindre l'attestation en pièce-jointe.",
        })
      )
    }

    const file = {
      contents: fs.createReadStream(request.file.path),
      filename: `${Date.now()}-${request.file.originalname}`,
    }

    const result = await addDCR({
      ...data,
      file,
      user: request.user,
    })

    return result.match({
      ok: () =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            success: 'Votre demande de raccordement a bien été enregistrée.',
          })
        ),
      err: (e: Error) => {
        logger.error(e)
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            ..._.omit(data, 'projectId'),
            error: "Votre demande n'a pas pu être prise en compte: " + e.message,
          })
        )
      },
    })
  })
)
