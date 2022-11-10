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
        .required('Date de mise en service obligatoire')
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Format de date de mise en service attendu : jj/mm/aaaa'),
      dateFileAttente: yup
        .string()
        .optional()
        .matches(
          /^\d{2}\/\d{2}\/\d{4}$/,
          `Format de date d'entrée en file d'attente attendu : jj/mm/aaaa`
        )
        .nullable(),
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

const formaterLesDonnées = (données: NonNullable<InferType<typeof csvDataSchema>>) =>
  données.map(({ numeroGestionnaire, dateMiseEnService, dateFileAttente }) => ({
    identifiantGestionnaireRéseau: numeroGestionnaire,
    dateMiseEnService: parse(dateMiseEnService, 'dd/MM/yyyy', new Date()),
    ...(dateFileAttente && { dateFileAttente: parse(dateFileAttente, 'dd/MM/yyyy', new Date()) }),
  }))

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
    upload.single('fichier-données-raccordement'),
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
        .andThen((données) =>
          démarrerImportDonnéesRaccordement({
            utilisateur: request.user,
            gestionnaire: 'Enedis',
            données: formaterLesDonnées(données),
          })
        )
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
