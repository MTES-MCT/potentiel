import { correctProjectData } from '../config'
import { Redirect, SystemError } from '../helpers/responses'
import { HttpRequest } from '../types'
import { FileContainer } from '../modules/file'
import ROUTES from '../routes'
import moment from 'moment'

import fs from 'fs'
import util from 'util'
const deleteFile = util.promisify(fs.unlink)

const FORMAT_DATE = 'DD/MM/YYYY'

const postCorrectProjectData = async (request: HttpRequest) => {
  console.log('Call to postCorrectProjectData received', request.body, request.file)

  if (!request.user) {
    return SystemError('User must be logged in')
  }

  const {
    projectId,
    projectVersionDate,
    notificationDate,
    numeroCRE,
    appelOffreId,
    periodeId,
    familleId,
    nomProjet,
    territoireProjet,
    puissance,
    prixReference,
    evaluationCarbone,
    note,
    nomCandidat,
    nomRepresentantLegal,
    email,
    adresseProjet,
    codePostalProjet,
    communeProjet,
    engagementFournitureDePuissanceAlaPointe,
    isFinancementParticipatif,
    isInvestissementParticipatif,
    isClasse,
    motifsElimination,
  } = request.body

  console.log('projectVersionDate', projectVersionDate)

  if (
    !notificationDate ||
    moment(notificationDate, FORMAT_DATE).format(FORMAT_DATE) !== notificationDate
  ) {
    return Redirect(
      ROUTES.ADMIN_NOTIFY_CANDIDATES({
        appelOffreId,
        periodeId,
      }),
      {
        error: 'La date de notification est au mauvais format.',
      }
    )
  }

  const correctedData = {
    numeroCRE,
    appelOffreId,
    periodeId,
    familleId,
    nomProjet,
    territoireProjet,
    puissance,
    prixReference,
    evaluationCarbone,
    note,
    nomCandidat,
    nomRepresentantLegal,
    email,
    adresseProjet,
    codePostalProjet,
    communeProjet,
    engagementFournitureDePuissanceAlaPointe,
    isFinancementParticipatif,
    isInvestissementParticipatif,
    isClasse,
    motifsElimination,
  }

  // TODO: transform strings to numbers
  console.log('correctedData', correctedData)

  const certificateFile: FileContainer | undefined = request.file
    ? {
        stream: fs.createReadStream(request.file.path),
        path: request.file.originalname,
      }
    : undefined

  const result = await correctProjectData({
    projectId,
    projectVersionDate: new Date(Number(projectVersionDate)),
    correctedData,
    certificateFile,
    newNotifiedOn: moment(notificationDate, FORMAT_DATE).toDate().getTime(),
    user: request.user,
  })

  console.log('postCorrectProjectData correctProjectData returned', result)

  if (request.file) await deleteFile(request.file.path)

  console.log('postCorrectProjectData temp file deleted')

  return result.match(
    () =>
      Redirect(ROUTES.PROJECT_DETAILS(projectId), {
        success: 'Les données du projet ont bien été mises à jour.',
      }),
    (e: Error) => {
      console.log('postCorrectProjectData error', e)
      return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
        error: "Votre demande n'a pas pu être prise en compte: " + e.message,
      })
    }
  )
}

export { postCorrectProjectData }
