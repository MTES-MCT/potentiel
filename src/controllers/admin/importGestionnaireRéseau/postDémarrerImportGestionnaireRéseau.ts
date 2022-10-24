import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { démarrerImportGestionnaireRéseau, ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { upload } from '../../upload'
import { parseCsv } from '../../../helpers/parseCsv'
import { errAsync, logger, okAsync } from '@core/utils'
import * as yup from 'yup'
import {
  CsvValidationError,
  errorResponse,
  mapYupValidationErrorToCsvValidationError,
  stringToDateYupTransformation,
} from '../../helpers'
import { ValidationError } from 'yup'
import { Request } from 'express'
import { RésultatSoumissionFormulaire } from 'express-session'
import {
  DonnéesDeMiseAJourObligatoiresError,
  DémarrageImpossibleError,
} from '@modules/imports/gestionnaireRéseau'

const csvDataSchema = yup
  .array()
  .ensure()
  .min(1, 'Le fichier ne doit pas être vide')
  .of(
    yup.object({
      numeroGestionnaire: yup.string().ensure().required('Le numéro gestionnaire est obligatoire'),
      'date de MES': yup
        .date()
        .required('La date de mise en service est obligatoire')
        .transform((_, originalValue) => stringToDateYupTransformation(originalValue, 'dd/MM/yyyy'))
        .typeError(`La date de mise en service n'est pas valide`) as yup.DateSchema<Date>,
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

const formatterLesDonnées = (données: Array<{ numeroGestionnaire: string; 'date de MES': Date }>) =>
  données.map((d) => ({
    identifiantGestionnaireRéseau: d.numeroGestionnaire,
    dateMiseEnService: d['date de MES'],
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

if (!!process.env.ENABLE_IMPORT_GESTIONNAIRE_RESEAU) {
  v1Router.post(
    routes.POST_DEMARRER_IMPORT_GESTIONNAIRE_RESEAU,
    ensureRole(['admin', 'dgec-validateur']),
    upload.single('fichier-import-gestionnaire-réseau'),
    asyncHandler(async (request, response) => {
      if (!request.file || !request.file.path) {
        setFormResult(request, routes.IMPORT_GESTIONNAIRE_RESEAU, {
          type: 'échec',
          raison: 'Le fichier est obligatoire',
        })
        return response.redirect(routes.IMPORT_GESTIONNAIRE_RESEAU)
      }

      await parseCsv(request.file.path, {
        delimiter: ';',
        encoding: 'utf8',
      })
        .andThen(validerLesDonnéesDuFichierCsv)
        .andThen((données) =>
          démarrerImportGestionnaireRéseau({
            utilisateur: request.user,
            gestionnaire: 'Enedis',
            données: formatterLesDonnées(données),
          })
        )
        .match(
          () => {
            setFormResult(request, routes.IMPORT_GESTIONNAIRE_RESEAU, {
              type: 'succès',
            })
            return response.redirect(routes.IMPORT_GESTIONNAIRE_RESEAU)
          },
          (error) => {
            if (error instanceof CsvValidationError) {
              setFormResult(request, routes.IMPORT_GESTIONNAIRE_RESEAU, {
                type: 'échec',
                raison: error.message,
                erreursDeValidationCsv: error.détails,
              })
              return response.redirect(routes.IMPORT_GESTIONNAIRE_RESEAU)
            }

            if (
              error instanceof DémarrageImpossibleError ||
              error instanceof DonnéesDeMiseAJourObligatoiresError
            ) {
              setFormResult(request, routes.IMPORT_GESTIONNAIRE_RESEAU, {
                type: 'échec',
                raison: error.message,
              })
              return response.redirect(routes.IMPORT_GESTIONNAIRE_RESEAU)
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
