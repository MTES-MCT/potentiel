import { correctProjectData } from '../config'
import { Redirect, SystemError } from '../helpers/responses'
import { HttpRequest } from '../types'
import { FileContents } from '../modules/file'
import ROUTES from '../routes'
import moment from 'moment-timezone'

import fs from 'fs'
import util from 'util'
import { IllegalProjectDataError } from '../modules/project/errors'
import sanitize from 'sanitize-filename'
const deleteFile = util.promisify(fs.unlink)

const FORMAT_DATE = 'DD/MM/YYYY'

const postCorrectProjectData = async (request: HttpRequest) => {
  if (!request.user) {
    return SystemError('User must be logged in')
  }

  const {
    projectId,
    projectVersionDate,
    notificationDate,
    numeroCRE,
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
    participatif,
    isClasse,
    motifsElimination,
    appelOffreAndPeriode,
  } = request.body

  const [appelOffreId, periodeId] = appelOffreAndPeriode?.split('|')
  const { isFinancementParticipatif, isInvestissementParticipatif } =
    participatif === 'investissement'
      ? { isFinancementParticipatif: false, isInvestissementParticipatif: true }
      : participatif === 'financement'
      ? { isFinancementParticipatif: true, isInvestissementParticipatif: false }
      : { isFinancementParticipatif: false, isInvestissementParticipatif: false }

  if (
    !notificationDate ||
    moment(notificationDate, FORMAT_DATE).format(FORMAT_DATE) !== notificationDate
  ) {
    return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
      error: 'La date de notification est au mauvais format.',
      ...request.body,
    })
  }

  const correctedData = {
    numeroCRE,
    appelOffreId,
    periodeId,
    familleId,
    nomProjet,
    territoireProjet,
    puissance: Number(puissance),
    prixReference: Number(prixReference),
    evaluationCarbone: Number(evaluationCarbone),
    note: Number(note),
    nomCandidat,
    nomRepresentantLegal,
    email,
    adresseProjet,
    codePostalProjet,
    communeProjet,
    engagementFournitureDePuissanceAlaPointe: Boolean(engagementFournitureDePuissanceAlaPointe),
    isFinancementParticipatif: Boolean(isFinancementParticipatif),
    isInvestissementParticipatif: Boolean(isInvestissementParticipatif),
    motifsElimination,
  }

  const certificateFile = request.file
    ? {
        contents: fs.createReadStream(request.file.path),
        filename: sanitize(`${Date.now()}-${request.file.originalname}`),
      }
    : undefined

  const result = await correctProjectData({
    projectId,
    projectVersionDate: new Date(Number(projectVersionDate)),
    correctedData,
    certificateFile,
    newNotifiedOn: moment(notificationDate, FORMAT_DATE).tz('Europe/London').toDate().getTime(),
    user: request.user,
    shouldGrantClasse: Number(isClasse) === 1,
  })

  if (request.file) await deleteFile(request.file.path)

  return result.match(
    () =>
      Redirect(ROUTES.PROJECT_DETAILS(projectId), {
        success:
          'Les données du projet ont bien été mises à jour. N‘hésitez pas à rafraichir la page pour avoir les données à jour.',
      }),
    (e) => {
      console.error(e)

      if (e instanceof IllegalProjectDataError) {
        return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
          error:
            "Votre demande n'a pas pu être prise en compte: " +
            Object.entries(e.errorsInFields)
              .map(([key, value]) => `${key} (${value})`)
              .join(', '),
          ...request.body,
        })
      }

      return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
        error: "Votre demande n'a pas pu être prise en compte: " + e.message,
        ...request.body,
      })
    }
  )
}

export { postCorrectProjectData }
