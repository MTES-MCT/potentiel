import fs from 'fs'
import _ from 'lodash'
import moment from 'moment'
import { logger, pathExists } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { addGarantiesFinancieres } from '../../useCases'
import { ensureLoggedIn, ensureRole } from '../auth'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.DEPOSER_GARANTIES_FINANCIERES_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  upload.single('file'),
  async (request, response) => {
    const data: any = _.pick(request.body, ['gfDate', 'projectId'])
    const { projectId } = data

    if (!data.gfDate) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Vos garantieres financières n'ont pas pu être transmises. La date de constitution est obligatoire",
        })
      )
    }

    // Convert date
    try {
      if (data.gfDate) {
        const date = moment(data.gfDate, 'DD/MM/YYYY')
        if (!date.isValid()) throw new Error('invalid date format')
        data.date = date.toDate().getTime()
      }
    } catch (error) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Vos garantieres financières n'ont pas pu être transmises. La date envoyée n'est pas au bon format (JJ/MM/AAAA)",
        })
      )
    }

    const attestationExists: boolean = !!request.file && (await pathExists(request.file.path))

    if (!attestationExists) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Vos garantieres financières n'ont pas pu être transmises. Merci de joindre l'attestation en pièce-jointe.",
        })
      )
    }

    const file = {
      contents: fs.createReadStream(request.file.path),
      filename: `${Date.now()}-${request.file.originalname}`,
    }

    const result = await addGarantiesFinancieres({
      ...data,
      file,
      user: request.user,
    })

    return result.match({
      ok: () =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            success: 'Votre constitution de garanties financières a bien été enregistrée.',
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
  }
)
