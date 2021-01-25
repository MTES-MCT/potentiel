import fs from 'fs'
import _ from 'lodash'
import moment from 'moment'
import util from 'util'
import { pathExists, logger } from '../core/utils'
import { Redirect, SystemError } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { addDCR } from '../useCases'

const deleteFile = util.promisify(fs.unlink)

const postDCR = async (request: HttpRequest) => {
  if (!request.user) {
    return SystemError('User must be logged in')
  }

  const data: any = _.pick(request.body, ['dcrDate', 'projectId', 'numeroDossier'])
  const { projectId } = data

  if (!data.dcrDate) {
    return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
      error:
        "Votre demande de raccordement n'a pas pu être transmise. La date d'attestation est obligatoire",
    })
  }

  // Convert date
  try {
    if (data.dcrDate) {
      const date = moment(data.dcrDate, 'DD/MM/YYYY')
      if (!date.isValid()) throw new Error('invalid date format')
      data.date = date.toDate().getTime()
    }
  } catch (error) {
    return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
      error:
        "Votre demande de raccordement n'a pas pu être transmise. La date envoyée n'est pas au bon format (JJ/MM/AAAA)",
    })
  }

  const attestationExists: boolean = !!request.file && (await pathExists(request.file.path))

  if (!attestationExists) {
    return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
      error:
        "Votre demande de raccordement n'a pas pu être transmise. Merci de joindre l'attestation en pièce-jointe.",
    })
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

  await deleteFile(request.file.path)

  return result.match({
    ok: () =>
      Redirect(ROUTES.PROJECT_DETAILS(projectId), {
        success: 'Votre demande de raccordement a bien été enregistrée.',
      }),
    err: (e: Error) => {
      logger.error(e)
      return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
        ..._.omit(data, 'projectId'),
        error: "Votre demande n'a pas pu être prise en compte: " + e.message,
      })
    },
  })
}

export { postDCR }
