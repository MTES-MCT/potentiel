import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { démarrerImportDonnéesRaccordement, ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { upload } from '../../upload'
import { parseCsv } from '../../../helpers/parseCsv'
import { errAsync, logger, okAsync } from '@core/utils'
import * as yup from 'yup'
import {
  CsvValidationError,
  errorResponse,
  mapYupValidationErrorToCsvValidationError,
} from '../../helpers'
import { InferType, ValidationError } from 'yup'
import { Request } from 'express'
import { RésultatSoumissionFormulaire } from 'express-session'
import {
  DonnéesDeMiseAJourObligatoiresError,
  DonnéesRaccordement,
  DémarrageImpossibleError,
} from '@modules/imports/donnéesRaccordement'
import { CsvError } from 'csv-parse'
import { parse } from 'date-fns'

const csvDataSchema = yup
  .array()
  .ensure()
  .min(1, 'Le fichier ne doit pas être vide')
  .of(
    yup.object({
      numeroGestionnaire: yup.string().ensure().required('Le numéro gestionnaire est obligatoire'),
      dateMiseEnService: yup
        .string()
        .notRequired()
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, {
          message: `Format de date d'entrée en file d'attente attendu : jj/mm/aaaa`,
          excludeEmptyString: true,
        }),
      dateFileAttente: yup
        .string()
        .notRequired()
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, {
          message: `Format de date d'entrée en file d'attente attendu : jj/mm/aaaa`,
          excludeEmptyString: true,
        }),
    })
  )

const validerLesDonnéesDuFichierCsv = (données: Record<string, string>[]) => {
  try {
    const donnéesValidées = csvDataSchema.validateSync(données, { abortEarly: false })

    if (!donnéesValidées) {
      return errAsync(new CsvValidationError())
    }

    return okAsync(donnéesValidées)
  } catch (error) {
    if (error instanceof ValidationError) {
      return errAsync(mapYupValidationErrorToCsvValidationError(error))
    }

    return errAsync(new CsvValidationError())
  }
}

const parseDate = (date: string) => parse(date, 'dd/MM/yyyy', new Date())

const formaterDonnées = (
  données: NonNullable<InferType<typeof csvDataSchema>>
): DonnéesRaccordement[] =>
  données.reduce((donnéesFormatées, { numeroGestionnaire, dateMiseEnService, dateFileAttente }) => {
    if (dateMiseEnService && dateFileAttente) {
      return [
        ...donnéesFormatées,
        {
          identifiantGestionnaireRéseau: numeroGestionnaire,
          dateMiseEnService: parseDate(dateMiseEnService),
          dateFileAttente: parseDate(dateFileAttente),
        },
      ]
    }
    if (dateMiseEnService && !dateFileAttente) {
      return [
        ...donnéesFormatées,
        {
          identifiantGestionnaireRéseau: numeroGestionnaire,
          dateMiseEnService: parseDate(dateMiseEnService),
        },
      ]
    }
    if (!dateMiseEnService && dateFileAttente) {
      return [
        ...donnéesFormatées,
        {
          identifiantGestionnaireRéseau: numeroGestionnaire,
          dateFileAttente: parseDate(dateFileAttente),
        },
      ]
    }
    return donnéesFormatées
  }, [])

const setFormResult = (
  request: Request,
  formId: string,
  formResult: RésultatSoumissionFormulaire | undefined
) => {
  const form = request.session.forms?.[formId]

  request.session.forms = {
    ...request.session.forms,
    [formId]: {
      ...form,
      résultatSoumissionFormulaire: formResult,
    },
  }
}

if (!!process.env.ENABLE_IMPORT_DONNEES_RACCORDEMENT) {
  v1Router.post(
    routes.POST_DEMARRER_IMPORT_DONNEES_RACCORDEMENT,
    ensureRole(['admin', 'dgec-validateur']),
    upload.single('fichier-donnees-raccordement'),
    asyncHandler(async (request, response) => {
      if (!request.file || !request.file.path) {
        setFormResult(request, routes.IMPORT_DONNEES_RACCORDEMENT, {
          type: 'échec',
          raison: 'Le fichier est obligatoire',
        })
        return response.redirect(routes.IMPORT_DONNEES_RACCORDEMENT)
      }

      await parseCsv(request.file.path, {
        delimiter: ';',
        encoding: 'utf8',
      })
        .andThen(validerLesDonnéesDuFichierCsv)
        .andThen((données) => {
          const donnéesFormatées = formaterDonnées(données)
          if (!donnéesFormatées) {
            return errAsync(
              new DonnéesDeMiseAJourObligatoiresError({
                utilisateur: request.user,
                gestionnaire: 'Enedis',
              })
            )
          }
          return démarrerImportDonnéesRaccordement({
            utilisateur: request.user,
            gestionnaire: 'Enedis',
            données: donnéesFormatées,
          })
        })
        .match(
          () => {
            setFormResult(request, routes.IMPORT_DONNEES_RACCORDEMENT, {
              type: 'succès',
            })
            return response.redirect(routes.IMPORT_DONNEES_RACCORDEMENT)
          },
          (error) => {
            if (error instanceof CsvValidationError) {
              setFormResult(request, routes.IMPORT_DONNEES_RACCORDEMENT, {
                type: 'échec',
                raison: error.message,
                erreursDeValidationCsv: error.détails,
              })
              return response.redirect(routes.IMPORT_DONNEES_RACCORDEMENT)
            }

            if (
              error instanceof DémarrageImpossibleError ||
              error instanceof DonnéesDeMiseAJourObligatoiresError
            ) {
              setFormResult(request, routes.IMPORT_DONNEES_RACCORDEMENT, {
                type: 'échec',
                raison: error.message,
              })
              return response.redirect(routes.IMPORT_DONNEES_RACCORDEMENT)
            }

            if (error instanceof CsvError) {
              setFormResult(request, routes.IMPORT_DONNEES_RACCORDEMENT, {
                type: 'échec',
                raison: 'Le fichier csv est mal formaté',
              })
              return response.redirect(routes.IMPORT_DONNEES_RACCORDEMENT)
            }

            logger.error(error)
            return errorResponse({
              request,
              response,
              customMessage:
                'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
            })
          }
        )
    })
  )
}
