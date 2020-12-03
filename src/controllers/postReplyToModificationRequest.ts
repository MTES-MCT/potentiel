import fs from 'fs'
import util from 'util'
import { acceptRecours } from '../config'
import { pathExists } from '../core/utils'
import { Redirect, SystemError } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'

const deleteFile = util.promisify(fs.unlink)

const postReplyToModificationRequest = async (request: HttpRequest) => {
  if (!request.user) {
    return SystemError('User must be logged in')
  }

  const { modificationRequestId, type, versionDate, submitAccept } = request.body

  const acceptedReply = typeof submitAccept === 'string'

  const courrierReponseExists: boolean = !!request.file && (await pathExists(request.file.path))

  if (!courrierReponseExists) {
    return Redirect(ROUTES.DEMANDE_PAGE_DETAILS(modificationRequestId), {
      error: "La réponse n'a pas pu être envoyée car il manque le courrier de réponse.",
    })
  }

  if (type === 'recours' && acceptedReply) {
    const result = await acceptRecours({
      modificationRequestId,
      versionDate: new Date(Number(versionDate)),
      responseFile: fs.createReadStream(request.file.path),
      submittedBy: request.user,
    })

    await deleteFile(request.file.path)

    return result.match(
      () =>
        Redirect(ROUTES.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          success: 'Votre réponse a bien été enregistrée.',
        }),
      (e) => {
        console.error(e)
        return Redirect(ROUTES.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: "Votre réponse n'a pas pu être prise en compte: " + e.message,
        })
      }
    )
  }

  await deleteFile(request.file.path)

  return Redirect(ROUTES.DEMANDE_PAGE_DETAILS(modificationRequestId), {
    error: 'Impossible de répondre à ce type de demande pour le moment?',
  })
}

export { postReplyToModificationRequest }
