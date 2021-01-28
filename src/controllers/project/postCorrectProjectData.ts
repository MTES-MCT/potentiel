import fs from 'fs'
import moment from 'moment-timezone'
import sanitize from 'sanitize-filename'
import { correctProjectData } from '../../config'
import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { IllegalProjectDataError } from '../../modules/project/errors'
import routes from '../../routes'
import { ensureLoggedIn, ensureRole } from '../auth'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

const FORMAT_DATE = 'DD/MM/YYYY'

v1Router.post(
  routes.ADMIN_CORRECT_PROJECT_DATA_ACTION,
  ensureLoggedIn(),
  upload.single('file'),
  ensureRole(['admin', 'dgec']),
  async (request, response) => {
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
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error: 'La date de notification est au mauvais format.',
          ...request.body,
        })
      )
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

    return await result.match(
      () => {
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            success:
              'Les données du projet ont bien été mises à jour. N‘hésitez pas à rafraichir la page pour avoir les données les plus récentes.',
          })
        )
      },
      (e) => {
        if (e instanceof IllegalProjectDataError) {
          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(projectId), {
              error:
                "Votre demande n'a pas pu être prise en compte: " +
                Object.entries(e.errorsInFields)
                  .map(([key, value]) => `${key} (${value})`)
                  .join(', '),
              ...request.body,
            })
          )
        }

        logger.error(e as Error)

        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            error: "Votre demande n'a pas pu être prise en compte.",
            ...request.body,
          })
        )
      }
    )
  }
)
