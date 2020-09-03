import { addGarantiesFinancieres } from '../useCases'
import { Redirect, SystemError } from '../helpers/responses'
import { makeProjectFilePath } from '../helpers/makeProjectFilePath'
import { Controller, HttpRequest } from '../types'
import { FileContainer } from '../modules/file'
import ROUTES from '../routes'
import _ from 'lodash'
import moment from 'moment'

import fs from 'fs'
import util from 'util'
const fileExists = util.promisify(fs.exists)
const deleteFile = util.promisify(fs.unlink)

const postGarantiesFinancieres = async (request: HttpRequest) => {
  console.log(
    'Call to postGarantiesFinancieres received',
    request.body,
    request.file
  )

  if (!request.user) {
    return SystemError('User must be logged in')
  }

  const data: any = _.pick(request.body, ['gfDate', 'projectId'])
  const { projectId } = data

  if (!data.gfDate) {
    return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
      error:
        "Vos garantieres financières n'ont pas pu être transmises. La date de constitution est obligatoire",
    })
  }

  // Convert date
  try {
    if (data.gfDate) {
      const date = moment(data.gfDate, 'DD/MM/YYYY')
      if (!date.isValid()) throw 'invalid date format'
      data.date = date.toDate().getTime()
    }
  } catch (error) {
    return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
      error:
        "Vos garantieres financières n'ont pas pu être transmises. La date envoyée n'est pas au bon format (JJ/MM/AAAA)",
    })
  }

  if (!request.file || !(await fileExists(request.file.path))) {
    return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
      error:
        "Vos garantieres financières n'ont pas pu être transmises. Merci de joindre l'attestation en pièce-jointe.",
    })
  }

  const file: FileContainer = {
    stream: fs.createReadStream(request.file.path),
    path: request.file.originalname,
  }

  const result = await addGarantiesFinancieres({
    ...data,
    file,
    user: request.user,
  })

  console.log('postGarantiesFinancieres addGarantiesFinancieres returned')

  await deleteFile(request.file.path)

  console.log('postGarantiesFinancieres temp file deleted')

  return result.match({
    ok: () =>
      Redirect(ROUTES.PROJECT_DETAILS(projectId), {
        success:
          'Votre constitution de garanties financières a bien été enregistrée.',
      }),
    err: (e: Error) => {
      console.log('postGarantiesFinancieres error', e)
      return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
        ..._.omit(data, 'projectId'),
        error: "Votre demande n'a pas pu être prise en compte: " + e.message,
      })
    },
  })
}

export { postGarantiesFinancieres }
